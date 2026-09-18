import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../config/db';

export const requestDeposit = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { amount, method } = req.body;
    const receiptImage = req.file?.filename;

    if (!amount || !receiptImage) {
      return res.status(400).json({ error: 'Amount and receipt image are required' });
    }

    const transaction = await prisma.walletTransaction.create({
      data: {
        userId,
        type: 'DEPOSIT',
        amount: Number(amount),
        status: 'PENDING',
        details: JSON.stringify({ method, receiptImage })
      }
    });

    res.status(201).json({ message: 'Deposit request submitted', transaction });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const requestWithdrawal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { amount, address, method } = req.body;

    if (!amount || !address) {
      return res.status(400).json({ error: 'Amount and wallet address are required' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isActive) {
      return res.status(403).json({ error: 'عذراً، حسابك موقوف مؤقتاً. يرجى التواصل مع الدعم.' });
    }

    // Check balance
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Create pending withdrawal transaction
    const transaction = await prisma.$transaction(async (tx) => {
      // Deduct from main balance and lock it
      await tx.wallet.update({
        where: { userId },
        data: {
          balance: { decrement: Number(amount) },
          lockedBalance: { increment: Number(amount) }
        }
      });

      return await tx.walletTransaction.create({
        data: {
          userId,
          type: 'WITHDRAWAL',
          amount: Number(amount),
          status: 'PENDING',
          details: JSON.stringify({ method, address })
        }
      });
    });

    res.status(201).json({ message: 'Withdrawal request submitted', transaction });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getWalletBalance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    const transactions = await prisma.walletTransaction.findMany({ 
      where: { userId }, 
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    res.json({ wallet, transactions });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
