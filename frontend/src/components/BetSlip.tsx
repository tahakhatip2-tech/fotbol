import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

  useEffect(() => {
    if (selection) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
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

  const modalContent = (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-[90] backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="fixed bottom-0 right-0 left-0 md:left-auto w-full md:w-96 bg-card border-t md:border-l border-border shadow-2xl rounded-t-2xl md:rounded-tr-none md:rounded-tl-2xl z-[100] flex flex-col max-h-[85vh]">
        <div className="bg-primary text-primary-foreground py-3 px-4 flex justify-between items-center shrink-0 rounded-t-2xl md:rounded-none">
        <h3 className="font-bold text-base">قسيمة الرهان</h3>
        <button onClick={onClose} className="hover:opacity-80 font-bold px-2 py-1 bg-white/10 rounded-md text-xs">إغلاق ✕</button>
      </div>

      <div className="p-4 md:p-5 overflow-y-auto flex-1 no-scrollbar min-h-0">
        <div className="mb-3">
          <div className="text-xs text-muted-foreground mb-1">{selection.team1} ضد {selection.team2}</div>
          <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span className="font-bold text-sm md:text-base">{selection.selectionLabel}</span>
            <span className="bg-primary/10 text-primary px-3 py-0.5 rounded-md font-bold text-sm">{selection.odds}</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-muted-foreground mb-1.5 flex justify-between">
            <span>مبلغ الرهان (Stake)</span>
            <span className="font-bold text-primary">المتاح: ${useBonus ? bonusBalance.toFixed(2) : realBalance.toFixed(2)}</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
            <input 
              type="number" 
              value={stake}
              onChange={(e) => setStake(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="0.00"
              className="w-full bg-background border border-border rounded-lg py-2 pl-8 pr-3 outline-none focus:border-primary transition-colors text-lg font-bold"
            />
          </div>
        </div>
        
        {bonusBalance > 0 && (
          <div className="mb-4 bg-blue-50 border border-blue-100 p-2.5 rounded-lg flex items-center gap-2.5">
            <input 
              type="checkbox" 
              id="useBonusToggle" 
              checked={useBonus}
              onChange={(e) => setUseBonus(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded"
            />
            <label htmlFor="useBonusToggle" className="text-xs font-medium text-blue-900 flex-1 cursor-pointer">
              استخدام رصيد البونص 
              <span className="block text-[10px] text-blue-600/80">المتوفر: ${bonusBalance.toFixed(2)}</span>
            </label>
          </div>
        )}
        
        {error && <div className="bg-red-500/10 text-red-500 p-2 rounded-md text-xs mb-3">{error}</div>}

        {stake && Number(stake) > 0 && (
          <div className="bg-muted p-3 rounded-xl mb-3 space-y-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">العائد المحتمل:</span>
              <span className="font-bold text-sm">${potentialReturn}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">الربح الصافي:</span>
              <span className="font-bold text-green-500">+${potentialProfit}</span>
            </div>
          </div>
        )}

        <div className="bg-yellow-500/10 text-yellow-700 p-2 rounded-lg text-[10px] text-center mb-1">
          بمجرد التأكيد، لا يمكن تعديل أو إلغاء الرهان.
        </div>
      </div>

      <div className="p-3 border-t border-border shrink-0 bg-card">
        <Button 
          className="w-full shadow-sm" 
          size="default" 
          disabled={!stake || Number(stake) <= 0 || isConfirming || Number(stake) > (useBonus ? bonusBalance : realBalance)}
          onClick={handleConfirm}
        >
          {isConfirming ? 'جاري التأكيد...' : 'تأكيد الرهان'}
        </Button>
      </div>
      </div>
    </>
  );

  // Render modal directly into the body to escape any CSS transform/animation containing blocks
  return createPortal(modalContent, document.body);
};
