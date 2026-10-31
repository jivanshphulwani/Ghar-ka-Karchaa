import React from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  PiggyBank, 
  Sparkles, 
  Wallet, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  PartyPopper
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/formatters';
import { evaluateSavingsHealth } from '../utils/calculations';

interface MonthlySavingsHeroProps {
  onOpenAddModal: () => void;
  onOpenSettingsModal: () => void;
}

export const MonthlySavingsHero: React.FC<MonthlySavingsHeroProps> = ({
  onOpenAddModal,
  onOpenSettingsModal,
}) => {
  const { currentMonthSummary, familyConfig, allMonthSummaries, selectedMonth } = useExpense();

  const {
    totalIncome,
    totalSpent,
    totalSaved,
    savingsRate,
    targetSaved,
    dailyAverage,
    essentialSpent,
    discretionarySpent,
    monthLabel
  } = currentMonthSummary;

  const { currencySymbol, currencyCode } = familyConfig;
  const savingsHealth = evaluateSavingsHealth(savingsRate, totalSaved);

  // Compare to previous available month
  const currentIdx = allMonthSummaries.findIndex(s => s.monthKey === selectedMonth);
  const prevSummary = currentIdx !== -1 && currentIdx < allMonthSummaries.length - 1
    ? allMonthSummaries[currentIdx + 1]
    : null;

  const spendDiff = prevSummary ? totalSpent - prevSummary.totalSpent : null;
  const savingsDiff = prevSummary ? totalSaved - prevSummary.totalSaved : null;

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#059669', '#34d399', '#f59e0b', '#3b82f6']
    });
  };

  const targetPercentage = targetSaved > 0 ? Math.min(200, Math.round((totalSaved / targetSaved) * 100)) : 0;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
              {monthLabel} Financial Health
            </span>
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${savingsHealth.badgeClass} bg-white/10 text-white`}>
              <span>{savingsHealth.emoji}</span>
              <span>{savingsHealth.badgeText}</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1 text-slate-100">
            Monthly Expense & Family Savings Summary
          </h2>
        </div>

        {/* Quick Action buttons */}
        <div className="flex items-center gap-2">
          {totalSaved >= targetSaved && totalSaved > 0 && (
            <button
              type="button"
              onClick={triggerCelebration}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-xs font-medium transition cursor-pointer"
            >
              <PartyPopper className="w-3.5 h-3.5 text-emerald-400" />
              <span>Celebrate Goal!</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenSettingsModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium border border-white/10 transition cursor-pointer"
          >
            <span>Income: {formatCurrency(totalIncome, currencySymbol, currencyCode)}</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Numbers: Income, Spent, Saved */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 relative z-10">
        
        {/* Total Household Income */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between backdrop-blur-xs">
          <div className="flex items-center justify-between text-slate-300 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-emerald-400" />
              Family Monthly Income
            </span>
            <button 
              type="button"
              onClick={onOpenSettingsModal} 
              className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {formatCurrency(totalIncome, currencySymbol, currencyCode)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Targeted monthly budget & in-hand salary
            </div>
          </div>
        </div>

        {/* Total Monthly Spend */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between backdrop-blur-xs">
          <div className="flex items-center justify-between text-slate-300 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              Total Spent in {monthLabel.split(' ')[0]}
            </span>
            <span className="text-[11px] text-slate-300 bg-rose-500/20 px-1.5 py-0.5 rounded">
              Avg {formatCurrency(dailyAverage, currencySymbol, currencyCode)}/day
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-rose-300">
              {formatCurrency(totalSpent, currencySymbol, currencyCode)}
            </div>
            <div className="text-xs text-slate-300 mt-1 flex items-center justify-between">
              <span>Essential: {formatCurrency(essentialSpent, currencySymbol, currencyCode)}</span>
              {spendDiff !== null && (
                <span className={`flex items-center font-medium ${spendDiff <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {spendDiff <= 0 ? '↓ ' : '↑ '}
                  {formatCurrency(Math.abs(spendDiff), currencySymbol, currencyCode)} vs last mo
                </span>
              )}
            </div>
          </div>
        </div>

        {/* How Much Saved This Month (Hero Highlight) */}
        <div className="bg-gradient-to-br from-emerald-600/30 via-emerald-600/20 to-teal-600/20 border-2 border-emerald-400/40 rounded-xl p-4 flex flex-col justify-between relative shadow-inner">
          <div className="flex items-center justify-between text-emerald-200 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <PiggyBank className="w-4 h-4 text-emerald-300" />
              Family Savings This Month
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
              {savingsRate.toFixed(1)}% Saved
            </span>
          </div>
          <div className="mt-2">
            <div className={`text-2xl sm:text-3xl font-black tracking-tight ${totalSaved >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
              {formatCurrency(totalSaved, currencySymbol, currencyCode)}
            </div>
            <div className="text-xs text-emerald-200 mt-1 flex items-center justify-between">
              <span>Goal: {formatCurrency(targetSaved, currencySymbol, currencyCode)}</span>
              {totalSaved >= targetSaved ? (
                <span className="text-emerald-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Met! (+{Math.max(0, totalSaved - targetSaved)})
                </span>
              ) : (
                <span className="text-amber-300 font-medium">
                  {formatCurrency(targetSaved - totalSaved, currencySymbol, currencyCode)} left to reach goal
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Progress Bar: Target Savings Achievement */}
      <div className="bg-black/25 rounded-xl p-3.5 border border-white/5 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">Monthly Savings Goal Progress:</span>
            <span className="text-emerald-400 font-bold">{targetPercentage}%</span>
            <span className="text-slate-400">
              ({formatCurrency(Math.max(0, totalSaved), currencySymbol, currencyCode)} of {formatCurrency(targetSaved, currencySymbol, currencyCode)} target)
            </span>
          </div>
          <div className="text-slate-300 text-[11px]">
            {savingsHealth.description}
          </div>
        </div>

        {/* Bar */}
        <div className="w-full bg-slate-700/60 rounded-full h-3 overflow-hidden p-0.5 border border-white/5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              totalSaved < 0
                ? 'bg-rose-500 w-full'
                : targetPercentage >= 100
                ? 'bg-gradient-to-r from-emerald-400 to-teal-300'
                : 'bg-gradient-to-r from-amber-400 to-emerald-400'
            }`}
            style={{ width: `${totalSaved < 0 ? 100 : Math.min(100, Math.max(4, targetPercentage))}%` }}
          />
        </div>

        {/* 50-30-20 Rule indicator breakdown for middle class budgeting */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10 text-center">
          <div className="bg-white/5 rounded-lg py-1.5 px-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              Essentials (Needs)
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-200">
              {formatCurrency(essentialSpent, currencySymbol, currencyCode)}
            </div>
            <div className="text-[10px] text-slate-400">
              {totalIncome > 0 ? ((essentialSpent / totalIncome) * 100).toFixed(0) : 0}% of income
            </div>
          </div>

          <div className="bg-white/5 rounded-lg py-1.5 px-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              Treats (Wants)
            </div>
            <div className="text-xs sm:text-sm font-bold text-amber-200">
              {formatCurrency(discretionarySpent, currencySymbol, currencyCode)}
            </div>
            <div className="text-[10px] text-slate-400">
              {totalIncome > 0 ? ((discretionarySpent / totalIncome) * 100).toFixed(0) : 0}% of income
            </div>
          </div>

          <div className="bg-white/5 rounded-lg py-1.5 px-2">
            <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-medium">
              Saved for Future
            </div>
            <div className="text-xs sm:text-sm font-bold text-emerald-300">
              {formatCurrency(totalSaved, currencySymbol, currencyCode)}
            </div>
            <div className="text-[10px] text-slate-400">
              {savingsRate.toFixed(0)}% of income
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
