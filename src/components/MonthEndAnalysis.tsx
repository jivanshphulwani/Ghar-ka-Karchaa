import React from 'react';
import { 
  TrendingDown, 
  PiggyBank, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  CreditCard, 
  Calendar,
  Flame,
  Award,
  ArrowRight,
  Info
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

export const MonthEndAnalysis: React.FC = () => {
  const { currentMonthSummary, familyConfig } = useExpense();
  const { currencySymbol, currencyCode } = familyConfig;

  const {
    monthLabel,
    totalIncome,
    totalSpent,
    totalSaved,
    savingsRate,
    targetSaved,
    dailyAverage,
    totalTransactions,
    essentialSpent,
    discretionarySpent,
    categoryBreakdown,
    memberBreakdown,
    paymentModeBreakdown,
    dailyBreakdown,
    peakSpendingDay
  } = currentMonthSummary;

  // Over budget categories
  const overBudgetCategories = categoryBreakdown.filter(c => c.isOverBudget);
  const underBudgetCategories = categoryBreakdown.filter(c => !c.isOverBudget && c.budget > 0);

  // Top 5 spending categories
  const topCategories = categoryBreakdown.slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* 1. Month-End Grand Spending & Savings Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
              End-of-Month Review • {monthLabel}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1.5">
              How Much Did We Spend in {monthLabel.split(' ')[0]}?
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500">Total Transactions Recorded</span>
            <div className="text-base font-bold text-slate-800">{totalTransactions} entries</div>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-5">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Total Spent</span>
            <div className="text-xl sm:text-2xl font-black text-rose-600 mt-1">
              {formatCurrency(totalSpent, currencySymbol, currencyCode)}
            </div>
            <span className="text-[11px] text-slate-400">
              {totalIncome > 0 ? ((totalSpent / totalIncome) * 100).toFixed(1) : 0}% of monthly income
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Total Family Saved</span>
            <div className={`text-xl sm:text-2xl font-black mt-1 ${totalSaved >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatCurrency(totalSaved, currencySymbol, currencyCode)}
            </div>
            <span className="text-[11px] text-slate-400">
              Savings Rate: {savingsRate.toFixed(1)}%
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Daily Burn Rate</span>
            <div className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
              {formatCurrency(dailyAverage, currencySymbol, currencyCode)}
            </div>
            <span className="text-[11px] text-slate-400">Average spent per day</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Savings Goal Status</span>
            <div className="text-base sm:text-lg font-bold text-slate-800 mt-1.5 flex items-center gap-1.5">
              {totalSaved >= targetSaved ? (
                <>
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-700">Goal Achieved!</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span className="text-amber-700 font-semibold">Short by {formatCurrency(Math.max(0, targetSaved - totalSaved), currencySymbol, currencyCode)}</span>
                </>
              )}
            </div>
            <span className="text-[11px] text-slate-400">Target was {formatCurrency(targetSaved, currencySymbol, currencyCode)}</span>
          </div>
        </div>

        {/* Peak Spending Day notice */}
        {peakSpendingDay && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Highest Single Day Spend:</strong> {peakSpendingDay.date} with a total of{' '}
                <strong>{formatCurrency(peakSpendingDay.amount, currencySymbol, currencyCode)}</strong> (e.g. rent, fees or grocery day).
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Category-Wise Breakdown with Budget Meters */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Where Did the Money Go? (महीने का श्रेणीवार खर्च)
            </h3>
            <p className="text-xs text-slate-500">
              Compare actual household spending against targeted middle class budgets
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              {underBudgetCategories.length} Under Budget
            </span>
            {overBudgetCategories.length > 0 && (
              <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                {overBudgetCategories.length} Exceeded Limit
              </span>
            )}
          </div>
        </div>

        {/* Category List */}
        <div className="space-y-4 mt-5">
          {categoryBreakdown.map((item) => {
            const pctOfSpend = item.percentageOfSpend;
            const pctOfBudget = item.budget > 0 ? Math.min(100, Math.round((item.amount / item.budget) * 100)) : 0;
            const overAmount = item.amount - item.budget;

            return (
              <div 
                key={item.category.id}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border"
                      style={{ 
                        backgroundColor: `${item.category.color}15`,
                        borderColor: `${item.category.color}30`,
                        color: item.category.color
                      }}
                    >
                      <CategoryIcon name={item.category.icon} className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-slate-800">
                        {item.category.name}
                      </span>
                      {item.category.hindiName && (
                        <span className="text-[11px] text-slate-400 ml-1.5 hidden sm:inline">
                          ({item.category.hindiName})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                      {formatCurrency(item.amount, currencySymbol, currencyCode)}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {pctOfSpend.toFixed(1)}% of total spend
                    </div>
                  </div>
                </div>

                {/* Progress bar vs Budget */}
                {item.budget > 0 ? (
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-500">
                        Budget: {formatCurrency(item.budget, currencySymbol, currencyCode)}
                      </span>
                      {item.isOverBudget ? (
                        <span className="text-rose-600 font-bold flex items-center gap-1">
                          Exceeded by {formatCurrency(overAmount, currencySymbol, currencyCode)}!
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">
                          {formatCurrency(item.budget - item.amount, currencySymbol, currencyCode)} buffer left
                        </span>
                      )}
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          item.isOverBudget ? 'bg-rose-500' : pctOfBudget > 85 ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(2, (item.amount / item.budget) * 100))}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic">
                    No budget target set
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Family Members & Payment Modes Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Family Member Spends */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-emerald-600" />
            <h4 className="font-bold text-slate-800 text-sm">
              Family Member Spending (किसने कितना खर्च किया)
            </h4>
          </div>

          <div className="space-y-3">
            {memberBreakdown.map((m) => (
              <div key={m.member} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{m.member}</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">
                      {formatCurrency(m.amount, currencySymbol, currencyCode)}
                    </span>
                    <span className="text-slate-400 ml-1.5">({m.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full" 
                    style={{ width: `${m.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Modes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <h4 className="font-bold text-slate-800 text-sm">
              Payment Methods (भुगतान का तरीका)
            </h4>
          </div>

          <div className="space-y-3">
            {paymentModeBreakdown.map((pm) => (
              <div key={pm.mode} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{pm.mode}</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">
                      {formatCurrency(pm.amount, currencySymbol, currencyCode)}
                    </span>
                    <span className="text-slate-400 ml-1.5">({pm.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-teal-600 h-full rounded-full" 
                    style={{ width: `${pm.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Practical Middle-Class Family Advice for Next Month */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 rounded-2xl p-5 border border-emerald-200">
        <div className="flex items-start gap-3">
          <Award className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-slate-700">
            <h4 className="font-bold text-emerald-900 text-sm">
              Middle Class Family Financial Wisdom for {monthLabel}
            </h4>
            <p>
              • <strong>Essential Needs:</strong> Represented {totalIncome > 0 ? ((essentialSpent / totalIncome) * 100).toFixed(0) : 0}% of your total earnings (Rent, Ration, Milk, Bills, Kids education). This is well within safe middle class limits.
            </p>
            <p>
              • <strong>Discretionary Spends:</strong> You spent {formatCurrency(discretionarySpent, currencySymbol, currencyCode)} on outside snacks, dining & personal items.
            </p>
            <p>
              • <strong>Next Month Strategy:</strong> To increase family savings by another 5%, look for wholesale monthly ration deals, audit ongoing phone/broadband plans, and cook weekend special meals together at home!
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
