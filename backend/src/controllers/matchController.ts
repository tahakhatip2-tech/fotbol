import { Request, Response } from 'express';
import prisma from '../config/db';

export const getMatches = async (req: Request, res: Response) => {
  try {
    const matches = await prisma.match.findMany({
      include: {
        odds: {
          where: { isActive: true }
        }
      },
      orderBy: { matchDate: 'asc' }
    });
    res.json(matches);
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const getMatchById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        odds: {
          where: { isActive: true }
        }
      }
    });
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    res.json(match);
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
