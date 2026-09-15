import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import matchRoutes from './routes/matchRoutes';
import betRoutes from './routes/betRoutes';
import adminRoutes from './routes/adminRoutes';
import walletRoutes from './routes/walletRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploads directory
import path from 'path';
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wallet', walletRoutes);

// Routes will be added here
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

export default app;
