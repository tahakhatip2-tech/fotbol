import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { placeBet } from '../api/matches';
import { getWallet } from '../api/wallet';

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
  
  const [useBonus, setUseBonus] = useState(false);
  const [bonusBalance, setBonusBalance] = useState(0);
  const [realBalance, setRealBalance] = useState(0);

  useEffect(() => {
    if (selection) {
      getWallet().then((res: any) => {
        if (res.wallet) {
          setBonusBalance(res.wallet.bonusBalance || 0);
          setRealBalance(res.wallet.balance || 0);
        }
      }).catch(console.error);
    }
  }, [selection]);

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
        oddsAtBet: selection.odds,
        useBonus
      });
      onConfirm();
    } catch (err: any) {
      setError(err.response?.data?.error || 'حدث خطأ أثناء معالجة الرهان. تأكد من توفر رصيد كافٍ.');
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-96 bg-card border-t md:border-l border-border shadow-2xl rounded-t-2xl md:rounded-tr-none md:rounded-tl-2xl z-50 flex flex-col max-h-[85vh]">
      <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center shrink-0 rounded-t-2xl md:rounded-none">
        <h3 className="font-bold text-lg">قسيمة الرهان</h3>
        <button onClick={onClose} className="hover:opacity-80 font-bold p-1">✕</button>
      </div>

      <div className="p-5 md:p-6 overflow-y-auto flex-1">
        <div className="mb-4">
          <div className="text-sm text-muted-foreground mb-1">{selection.team1} ضد {selection.team2}</div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">{selection.selectionLabel}</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">{selection.odds}</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-muted-foreground mb-2 flex justify-between">
            <span>مبلغ الرهان (Stake)</span>
            <span className="text-xs font-bold text-primary">المتاح: ${useBonus ? bonusBalance.toFixed(2) : realBalance.toFixed(2)}</span>
          </label>
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
        
        {bonusBalance > 0 && (
          <div className="mb-6 bg-blue-50/50 border border-blue-100 p-3 rounded-lg flex items-center gap-3">
            <input 
              type="checkbox" 
              id="useBonusToggle" 
              checked={useBonus}
              onChange={(e) => setUseBonus(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded"
            />
            <label htmlFor="useBonusToggle" className="text-sm font-medium text-blue-900 flex-1 cursor-pointer">
              استخدام رصيد البونص 
              <span className="block text-xs text-blue-600/80">المتوفر لديك: ${bonusBalance.toFixed(2)}</span>
            </label>
          </div>
        )}
        
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

        <div className="bg-yellow-500/10 text-yellow-600 p-3 rounded-lg text-xs mb-2">
          "بمجرد التأكيد، لا يمكن تعديل أو إلغاء هذا الرهان."
        </div>
      </div>

      <div className="p-4 border-t border-border shrink-0 bg-card">
        <Button 
          className="w-full" 
          size="lg" 
          disabled={!stake || Number(stake) <= 0 || isConfirming || Number(stake) > (useBonus ? bonusBalance : realBalance)}
          onClick={handleConfirm}
        >
          {isConfirming ? 'جاري التأكيد...' : 'تأكيد الرهان'}
        </Button>
      </div>
    </div>
  );
};
