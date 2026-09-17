import { Request, Response } from 'express';
import prisma from '../config/db';
import { MatchStatus } from '@prisma/client';
import { uploadFileToSupabase } from '../utils/supabaseStorage';
import fs from 'fs';

// Get Dashboard Stats
export const getStats = async (req: Request, res: Response) => {
  try {
    const usersCount = await prisma.user.count();
    const betsCount = await prisma.bet.count();
    const activeMatches = await prisma.match.count({
      where: { status: { in: ['UPCOMING', 'LIVE'] } }
    });

    res.json({ usersCount, betsCount, activeMatches });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching stats' });
  }
};

// Get Match Bets (for settlement table)
export const getMatchBets = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const bets = await prisma.bet.findMany({
      where: { matchId: id },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        settlement: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bets);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching match bets' });
  }
};

// Get All Users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        wallet: { select: { balance: true, lockedBalance: true, bonusBalance: true, lockedBonusBalance: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching users' });
  }
};

// Get All Bets
export const getAllBets = async (req: Request, res: Response) => {
  try {
    const bets = await prisma.bet.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        match: { select: { team1Name: true, team2Name: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 100 // limit to recent 100 for performance
    });
    res.json(bets);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching all bets' });
  }
};

// Create a Match
export const createMatch = async (req: Request, res: Response) => {
  try {
    let { team1Name, team1Logo, team2Name, team2Logo, league, matchDate, status, description, odds } = req.body;
    
    // Parse odds if sent as a JSON string from form-data
    if (typeof odds === 'string') {
      try {
        odds = JSON.parse(odds);
      } catch (e) {}
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files && files['team1Logo']) {
      const file = files['team1Logo'][0];
      try {
        team1Logo = await uploadFileToSupabase(file.path, file.filename, file.mimetype);
      } finally {
        // Clean up temp file
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      }
    }
    if (files && files['team2Logo']) {
      const file = files['team2Logo'][0];
      try {
        team2Logo = await uploadFileToSupabase(file.path, file.filename, file.mimetype);
      } finally {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      }
    }

    const match = await prisma.match.create({
      data: {
        team1Name: team1Name as string,
        team1Logo: team1Logo as string | undefined,
        team2Name: team2Name as string,
        team2Logo: team2Logo as string | undefined,
        league: league as string,
        matchDate: new Date(matchDate as string),
        status: status as MatchStatus,
        description: description as string | undefined,
        odds: {
          create: {
            team1Win: odds?.team1Win || 1.0,
            draw: odds?.draw || 1.0,
            team2Win: odds?.team2Win || 1.0,
          }
        }
      },
      include: { odds: true }
    });

    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating match' });
  }
};

// Update a Match
export const updateMatch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    let { team1Name, team1Logo, team2Name, team2Logo, league, matchDate, status, description, odds } = req.body;

    // Parse odds if sent as a JSON string from form-data
    if (typeof odds === 'string') {
      try {
        odds = JSON.parse(odds);
      } catch (e) {}
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files && files['team1Logo']) {
      const file = files['team1Logo'][0];
      try {
        team1Logo = await uploadFileToSupabase(file.path, file.filename, file.mimetype);
      } finally {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      }
    }
    if (files && files['team2Logo']) {
      const file = files['team2Logo'][0];
      try {
        team2Logo = await uploadFileToSupabase(file.path, file.filename, file.mimetype);
      } finally {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      }
    }

    // Check if match exists and is not finished
    const existingMatch = await prisma.match.findUnique({ where: { id } });
    if (!existingMatch) return res.status(404).json({ error: 'Match not found' });
    if (existingMatch.status === 'FINISHED') return res.status(400).json({ error: 'Cannot edit a finished match' });

    const match = await prisma.match.update({
      where: { id },
      data: {
        team1Name: team1Name as string,
        team1Logo: team1Logo as string | undefined,
        team2Name: team2Name as string,
        team2Logo: team2Logo as string | undefined,
        league: league as string,
        matchDate: new Date(matchDate as string),
        status: status as MatchStatus,
        description: description as string | undefined,
        odds: {
          updateMany: {
            where: { matchId: id },
            data: {
              team1Win: odds?.team1Win || 1.0,
              draw: odds?.draw || 1.0,
              team2Win: odds?.team2Win || 1.0,
            }
          }
        }
      },
      include: { odds: true }
    });

    res.json(match);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating match' });
  }
};

// Settle Match (determine outcome and pay bets)
export const settleMatch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { result } = req.body; // 'TEAM_1_WIN', 'DRAW', 'TEAM_2_WIN'

    const match = await prisma.match.findUnique({
      where: { id },
      include: { bets: { where: { status: 'PENDING' } } }
    });

    if (!match) return res.status(404).json({ error: 'Match not found' });
    if (match.status === 'FINISHED') return res.status(400).json({ error: 'Match already finished' });

    // Transaction for settlement
    await prisma.$transaction(async (tx) => {
      // 1. Update Match status and result
      await tx.match.update({
        where: { id },
        data: { status: 'FINISHED', result }
      });

      // 2. Process all pending bets
      for (const bet of match.bets) {
        const isWin = bet.selection === result;
        
        if (isWin) {
          // Update bet to WON and create Settlement
          await tx.bet.update({ where: { id: bet.id }, data: { status: 'WON' } });
          await tx.settlement.create({
            data: {
              matchId: match.id,
              betId: bet.id,
              amount: bet.potentialPayout,
              isWin: true
            }
          });
          
          // Add funds to user wallet
          await tx.wallet.update({
            where: { userId: bet.userId },
            data: { balance: { increment: bet.potentialPayout } }
          });
          
          // Create WalletTransaction
          await tx.walletTransaction.create({
            data: {
              userId: bet.userId,
              type: 'BET_WON',
              amount: bet.potentialPayout,
              details: `Won bet on match ${match.team1Name} vs ${match.team2Name}`
            }
          });
        } else {
          // Update bet to LOST
          await tx.bet.update({ where: { id: bet.id }, data: { status: 'LOST' } });
          await tx.settlement.create({
            data: {
              matchId: match.id,
              betId: bet.id,
              amount: 0,
              isWin: false
            }
          });
        }
      }
    });

    res.json({ message: 'Match settled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error settling match' });
  }
};

// Get Pending Transactions (Deposits and Withdrawals)
export const getPendingTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.walletTransaction.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { email: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching transactions' });
  }
};

// Process Transaction (Approve/Reject)
export const processTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { action } = req.body; // 'APPROVE' or 'REJECT'

    const transaction = await prisma.walletTransaction.findUnique({ where: { id } });
    if (!transaction || transaction.status !== 'PENDING') {
      return res.status(404).json({ error: 'Transaction not found or already processed' });
    }

    await prisma.$transaction(async (tx) => {
      if (action === 'APPROVE') {
        await tx.walletTransaction.update({
          where: { id },
          data: { status: 'COMPLETED' }
        });

        if (transaction.type === 'DEPOSIT') {
          await tx.wallet.update({
            where: { userId: transaction.userId },
            data: { balance: { increment: transaction.amount } }
          });
        } else if (transaction.type === 'WITHDRAWAL') {
          // Release locked balance completely
          await tx.wallet.update({
            where: { userId: transaction.userId },
            data: { lockedBalance: { decrement: transaction.amount } }
          });
        }
      } else if (action === 'REJECT') {
        await tx.walletTransaction.update({
          where: { id },
          data: { status: 'FAILED' }
        });

        if (transaction.type === 'WITHDRAWAL') {
          // Return locked balance to main balance
          await tx.wallet.update({
            where: { userId: transaction.userId },
            data: { 
              lockedBalance: { decrement: transaction.amount },
              balance: { increment: transaction.amount }
            }
          });
        }
      }
    });

    res.json({ message: `Transaction ${action.toLowerCase()}ed successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Server error processing transaction' });
  }
};

// Delete a Match
export const deleteMatch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const match = await prisma.match.findUnique({ where: { id } });
    if (!match) return res.status(404).json({ error: 'Match not found' });

    // Delete related records to prevent foreign key constraint errors
    await prisma.$transaction([
      prisma.odds.deleteMany({ where: { matchId: id } }),
      prisma.settlement.deleteMany({ where: { matchId: id } }),
      prisma.bet.deleteMany({ where: { matchId: id } }),
      prisma.match.delete({ where: { id } })
    ]);

    res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting match' });
  }
};

// Manage Bonus Balance
export const manageBonus = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.params as { id: string };
    const { action, amount } = req.body; // action: 'ADD' or 'DEDUCT'

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      return res.status(404).json({ error: 'User wallet not found' });
    }

    if (action === 'DEDUCT' && wallet.bonusBalance < amount) {
      return res.status(400).json({ error: 'Insufficient bonus balance to deduct' });
    }

    await prisma.$transaction(async (tx) => {
      // Update wallet
      await tx.wallet.update({
        where: { userId },
        data: {
          bonusBalance: action === 'ADD' ? { increment: amount } : { decrement: amount }
        }
      });

      // Create transaction log
      await tx.walletTransaction.create({
        data: {
          userId,
          type: action === 'ADD' ? 'DEPOSIT' : 'WITHDRAWAL', // Re-use existing enums
          amount: action === 'ADD' ? amount : -amount,
          status: 'COMPLETED',
          details: `Bonus ${action === 'ADD' ? 'Granted' : 'Deducted'} by Admin`
        }
      });
    });

    res.json({ message: `Bonus ${action === 'ADD' ? 'added' : 'deducted'} successfully` });
  } catch (error) {
    console.error('Error managing bonus:', error);
    res.status(500).json({ error: 'Server error managing bonus' });
  }
};

// --- Leagues Management ---

// Get all leagues
export const getLeagues = async (req: Request, res: Response) => {
  try {
    const leagues = await prisma.league.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(leagues);
  } catch (error) {
    console.error('Error fetching leagues:', error);
    res.status(500).json({ error: 'Server error fetching leagues' });
  }
};

// Create a league
export const createLeague = async (req: Request, res: Response) => {
  try {
    const { name, logo, country } = req.body;
    if (!name) return res.status(400).json({ error: 'League name is required' });

    // Check if league exists
    const existing = await prisma.league.findUnique({ where: { name } });
    if (existing) return res.status(400).json({ error: 'League with this name already exists' });

    const league = await prisma.league.create({
      data: { name, logo, country }
    });
    res.status(201).json(league);
  } catch (error) {
    console.error('Error creating league:', error);
    res.status(500).json({ error: 'Server error creating league' });
  }
};

// Delete a league
export const deleteLeague = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await prisma.league.delete({ where: { id } });
    res.json({ message: 'League deleted successfully' });
  } catch (error) {
    console.error('Error deleting league:', error);
    res.status(500).json({ error: 'Server error deleting league' });
  }
};
