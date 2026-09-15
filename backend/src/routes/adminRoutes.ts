import { Router } from 'express';
import { getStats, createMatch, updateMatch, deleteMatch, settleMatch, getPendingTransactions, processTransaction, getMatchBets, getUsers, getAllBets } from '../controllers/adminController';
import { authenticate, requireRole } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

// Protect all admin routes
router.use(authenticate);
router.use(requireRole(['ADMIN', 'SUPER_ADMIN']));

router.get('/stats', getStats);
router.post('/matches', upload.fields([{ name: 'team1Logo', maxCount: 1 }, { name: 'team2Logo', maxCount: 1 }]), createMatch);
router.put('/matches/:id', upload.fields([{ name: 'team1Logo', maxCount: 1 }, { name: 'team2Logo', maxCount: 1 }]), updateMatch);
router.delete('/matches/:id', deleteMatch);
router.put('/matches/:id/settle', settleMatch);
router.get('/matches/:id/bets', getMatchBets);

router.get('/transactions', getPendingTransactions);
router.put('/transactions/:id/process', processTransaction);

router.get('/users', getUsers);
router.get('/bets', getAllBets);

export default router;
