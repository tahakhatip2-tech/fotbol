import { Router } from 'express';
import { placeBet, getUserBets } from '../controllers/betController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.post('/', placeBet);
router.get('/', getUserBets);

export default router;
