import { Router } from 'express';
import { requestDeposit, requestWithdrawal, getWalletBalance } from '../controllers/walletController';
import { authenticate } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getWalletBalance);
router.post('/deposit', upload.single('receipt'), requestDeposit);
router.post('/withdraw', requestWithdrawal);

export default router;
