import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';
import { placeBet } from '../api/matches';

interface BetSelection {
  matchId: string;
  team1: string;
  team2: string;
  selectionLabel: string;
  selectionValue: string;
  odds: number;
}

interface BetSlipProps {
  selection: BetSelection | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const BetSlip: React.FC<BetSlipProps> = ({ selection, onClose, onConfirm }) => {
  const [stake, setStake] = useState<number | ''>('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');

  if (!selection) return null;

  const potentialReturn = (Number(stake) * selection.odds).toFixed(2);
  const potentialProfit = ((Number(stake) * selection.odds) - Number(stake)).toFixed(2);

  const handleConfirm = async () => {
    setIsConfirming(true);
    setError('');
    try {
      await placeBet({
        matchId: selection.matchId,
        selection: selection.selectionValue,
        stake: Number(stake),
        oddsAtBet: selection.odds
      });
      onConfirm();
    } catch (err: any) {
      setError(err.response?.data?.error || 'حدث خطأ أثناء معالجة الرهان. تأكد من تسجيل الدخول وتوفر رصيد كافٍ.');
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-96 bg-card border-t md:border-l border-border shadow-2xl rounded-t-2xl md:rounded-tr-none md:rounded-tl-2xl z-50 overflow-hidden flex flex-col">
      <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <h3 className="font-bold text-lg">قسيمة الرهان</h3>
        <button onClick={onClose} className="hover:opacity-80">✕</button>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <div className="text-sm text-muted-foreground mb-1">{selection.team1} ضد {selection.team2}</div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">{selection.selectionLabel}</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">{selection.odds}</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-muted-foreground mb-2">مبلغ الرهان (Stake)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <input 
              type="number" 
              value={stake}
              onChange={(e) => setStake(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="0.00"
              className="w-full bg-background border border-border rounded-md py-2 pl-8 pr-4 outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        
        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm mb-4">{error}</div>}

        {stake && Number(stake) > 0 && (
          <div className="bg-muted p-4 rounded-xl mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">العائد المحتمل:</span>
              <span className="font-bold">${potentialReturn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">الربح الصافي:</span>
              <span className="font-bold text-green-500">+${potentialProfit}</span>
            </div>
          </div>
        )}

        <div className="bg-yellow-500/10 text-yellow-600 p-3 rounded-lg text-xs mb-6">
          "بمجرد التأكيد، لا يمكن تعديل أو إلغاء هذا الرهان."
        </div>

        <Button 
          className="w-full" 
          size="lg" 
          disabled={!stake || Number(stake) <= 0 || isConfirming}
          onClick={handleConfirm}
        >
          {isConfirming ? 'جاري التأكيد...' : 'تأكيد الرهان'}
        </Button>
      </div>
    </div>
  );
};
