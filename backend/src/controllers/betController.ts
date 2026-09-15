import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../config/db';

export const placeBet = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { matchId, selection, stake } = req.body;

    if (stake <= 0) {
      return res.status(400).json({ error: 'Stake must be greater than 0' });
    }

    // Use a transaction to ensure atomic bet placement
    const result = await prisma.$transaction(async (tx) => {
      // 1. Validate user balance
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet || wallet.balance < stake) {
        throw new Error('Insufficient balance');
      }

      // 2. Validate match status and start time
      const match = await tx.match.findUnique({
        where: { id: matchId },
        include: { odds: { where: { isActive: true } } }
      });

      if (!match) throw new Error('Match not found');
      if (match.status !== 'UPCOMING') throw new Error('Betting is closed for this match');
      if (new Date(match.matchDate) <= new Date()) throw new Error('Match has already started');

      // 3. Get odds
      const currentOdds = match.odds[0];
      if (!currentOdds) throw new Error('Odds are currently unavailable');

      let oddsAtBet = 0;
      if (selection === 'TEAM_1_WIN') oddsAtBet = currentOdds.team1Win;
      else if (selection === 'DRAW') oddsAtBet = currentOdds.draw;
      else if (selection === 'TEAM_2_WIN') oddsAtBet = currentOdds.team2Win;

      if (oddsAtBet <= 1) throw new Error('Invalid odds');

      const potentialPayout = stake * oddsAtBet;

      // 4. Deduct stake and lock balance
      await tx.wallet.update({
        where: { userId },
        data: {
          balance: { decrement: stake },
          lockedBalance: { increment: stake }
        }
      });

      // 5. Create transaction record
      await tx.walletTransaction.create({
        data: {
          userId,
          type: 'BET_PLACED',
          amount: -stake,
          status: 'COMPLETED',
          details: `Bet placed on match ${matchId}`
        }
      });

      // 6. Create immutable bet
      const bet = await tx.bet.create({
        data: {
          userId,
          matchId,
          selection,
          stake,
          oddsAtBet,
          potentialPayout,
          status: 'PENDING'
        }
      });

      return bet;
    });

    res.status(201).json({ message: 'Bet confirmed', bet: result });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Server error' });
  }
};

export const getUserBets = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const bets = await prisma.bet.findMany({
      where: { userId },
      include: {
        match: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(bets);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
