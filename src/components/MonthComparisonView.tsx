import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  BarChart3, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency, getMonthLabel } from '../utils/formatters';
import { DEFAULT_CATEGORIES } from '../data/categories';
import { CategoryIcon } from './CategoryIcon';

export const MonthComparisonView: React.FC = () => {
  const { allMonthSummaries, familyConfig } = useExpense();
  const { currencySymbol, currencyCode } = familyConfig;

  // Month A and Month B for side-by-side comparison
  const [monthAKey, setMonthAKey] = useState<string>(() => {
    return allMonthSummaries[0]?.monthKey || '';
  });

  const [monthBKey, setMonthBKey] = useState<string>(() => {
    return allMonthSummaries[1]?.monthKey || allMonthSummaries[0]?.monthKey || '';
  });

  const summaryA = allMonthSummaries.find(s => s.monthKey === monthAKey) || allMonthSummaries[0];
  const summaryB = allMonthSummaries.find(s => s.monthKey === monthBKey) || allMonthSummaries[1] || summaryA;

  // Differences: Month A minus Month B
  const spendDiff = summaryA && summaryB ? summaryA.totalSpent - summaryB.totalSpent : 0;
  const savingsDiff = summaryA && summaryB ? summaryA.totalSaved - summaryB.totalSaved : 0;
  const savingsRateDiff = summaryA && summaryB ? summaryA.savingsRate - summaryB.savingsRate : 0;

  // Category comparisons between Month A and Month B
  const categoryDiffs = DEFAULT_CATEGORIES.map(cat => {
    const itemA = summaryA?.categoryBreakdown.find(c => c.category.id === cat.id);
    const itemB = summaryB?.categoryBreakdown.find(c => c.category.id === cat.id);
    const amountA = itemA?.amount || 0;
    const amountB = itemB?.amount || 0;
    const diff = amountA - amountB;
    const pctDiff = amountB > 0 ? (diff / amountB) * 100 : amountA > 0 ? 100 : 0;

    return {
      category: cat,
      amountA,
      amountB,
      diff,
      pctDiff,
    };
  }).filter(c => c.amountA > 0 || c.amountB > 0)
    .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));

  // Find max spend across all months to scale visual bars
  const maxSpend = Math.max(
    ...allMonthSummaries.map(s => Math.max(s.totalSpent, s.totalIncome)),
    50000
  );

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                Month-on-Month Comparison
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1.5">
              Compare Every Month's Spending & Savings (महीनों की तुलना)
            </h3>
            <p className="text-xs text-slate-500">
              Track how your household expenditures change and discover which month had the best savings.
            </p>
          </div>

          {/* Month A vs Month B selector */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-600">Month A:</span>
              <select
                value={monthAKey}
                onChange={(e) => setMonthAKey(e.target.value)}
                className="text-xs font-bold bg-white border border-slate-200 text-slate-800 py-1.5 px-2.5 rounded-lg focus:outline-none cursor-pointer"
              >
                {allMonthSummaries.map(s => (
                  <option key={s.monthKey} value={s.monthKey}>
                    {s.monthLabel}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-slate-400 font-bold text-xs">vs</span>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-600">Month B:</span>
              <select
                value={monthBKey}
                onChange={(e) => setMonthBKey(e.target.value)}
                className="text-xs font-bold bg-white border border-slate-200 text-slate-800 py-1.5 px-2.5 rounded-lg focus:outline-none cursor-pointer"
              >
                {allMonthSummaries.map(s => (
                  <option key={s.monthKey} value={s.monthKey}>
                    {s.monthLabel}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Direct Comparison Metric Cards (Month A vs Month B) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Spending Comparison */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Total Spending Comparison</span>
              <span className="text-[11px] text-slate-400">Month A vs B</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 mb-2">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="text-[11px] text-slate-500 truncate">{summaryA?.monthLabel}</div>
                <div className="text-base sm:text-lg font-bold text-slate-900">
                  {formatCurrency(summaryA?.totalSpent || 0, currencySymbol, currencyCode)}
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="text-[11px] text-slate-500 truncate">{summaryB?.monthLabel}</div>
                <div className="text-base sm:text-lg font-bold text-slate-600">
                  {formatCurrency(summaryB?.totalSpent || 0, currencySymbol, currencyCode)}
                </div>
              </div>
            </div>
          </div>

          <div className={`mt-2 p-2 rounded-lg text-xs font-medium flex items-center justify-between ${
            spendDiff < 0 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : spendDiff > 0 
              ? 'bg-rose-50 text-rose-800 border border-rose-200'
              : 'bg-slate-50 text-slate-700'
          }`}>
            <span className="flex items-center gap-1">
              {spendDiff < 0 ? (
                <>
                  <ArrowDownRight className="w-4 h-4 text-emerald-600" />
                  <span>Spent <strong>{formatCurrency(Math.abs(spendDiff), currencySymbol, currencyCode)} less</strong> in {summaryA?.monthLabel.split(' ')[0]}</span>
                </>
              ) : spendDiff > 0 ? (
                <>
                  <ArrowUpRight className="w-4 h-4 text-rose-600" />
                  <span>Spent <strong>{formatCurrency(spendDiff, currencySymbol, currencyCode)} more</strong> in {summaryA?.monthLabel.split(' ')[0]}</span>
                </>
              ) : (
                <>
                  <Minus className="w-4 h-4 text-slate-400" />
                  <span>Exact same spending</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Total Family Savings Comparison */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Family Savings Comparison</span>
              <span className="text-[11px] text-slate-400">Net Saved</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 mb-2">
              <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                <div className="text-[11px] text-emerald-800 truncate">{summaryA?.monthLabel}</div>
                <div className="text-base sm:text-lg font-bold text-emerald-700">
                  {formatCurrency(summaryA?.totalSaved || 0, currencySymbol, currencyCode)}
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="text-[11px] text-slate-500 truncate">{summaryB?.monthLabel}</div>
                <div className="text-base sm:text-lg font-bold text-slate-600">
                  {formatCurrency(summaryB?.totalSaved || 0, currencySymbol, currencyCode)}
                </div>
              </div>
            </div>
          </div>

          <div className={`mt-2 p-2 rounded-lg text-xs font-medium flex items-center justify-between ${
            savingsDiff > 0 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : savingsDiff < 0 
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-slate-50 text-slate-700'
          }`}>
            <span className="flex items-center gap-1">
              {savingsDiff > 0 ? (
                <>
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                  <span>Saved <strong>{formatCurrency(savingsDiff, currencySymbol, currencyCode)} more</strong> in {summaryA?.monthLabel.split(' ')[0]}!</span>
                </>
              ) : savingsDiff < 0 ? (
                <>
                  <ArrowDownRight className="w-4 h-4 text-amber-600" />
                  <span>Saved <strong>{formatCurrency(Math.abs(savingsDiff), currencySymbol, currencyCode)} less</strong> in {summaryA?.monthLabel.split(' ')[0]}</span>
                </>
              ) : (
                <>
                  <Minus className="w-4 h-4 text-slate-400" />
                  <span>Exact same savings</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Savings Rate % Comparison */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Savings Rate Percentage</span>
              <span className="text-[11px] text-slate-400">% of Income</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 mb-2">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="text-[11px] text-slate-500 truncate">{summaryA?.monthLabel}</div>
                <div className="text-base sm:text-lg font-bold text-slate-900">
                  {summaryA?.savingsRate.toFixed(1)}%
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="text-[11px] text-slate-500 truncate">{summaryB?.monthLabel}</div>
                <div className="text-base sm:text-lg font-bold text-slate-600">
                  {summaryB?.savingsRate.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 p-2 rounded-lg bg-slate-50 text-slate-700 text-xs font-medium flex items-center justify-between">
            <span className="text-slate-500">Margin Delta:</span>
            <span className={`font-bold ${savingsRateDiff >= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
              {savingsRateDiff >= 0 ? `+${savingsRateDiff.toFixed(1)}%` : `${savingsRateDiff.toFixed(1)}%`}
            </span>
          </div>
        </div>

      </div>

      {/* 3. Multi-Month Trend Chart (All Months Visual Comparison) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              Historical Monthly Spend & Savings Chart
            </h3>
            <p className="text-xs text-slate-500">
              Visual comparison across recorded months (Spending vs Savings)
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500" />
              <span className="text-slate-600">Total Spent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-slate-600">Family Saved</span>
            </div>
          </div>
        </div>

        {/* Visual Chart Bars */}
        <div className="space-y-6 mt-6">
          {allMonthSummaries.map((month) => {
            const spentWidth = Math.min(100, (month.totalSpent / maxSpend) * 100);
            const savedWidth = Math.min(100, (Math.max(0, month.totalSaved) / maxSpend) * 100);

            return (
              <div key={month.monthKey} className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900">{month.monthLabel}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {month.savingsRate.toFixed(1)}% Saved
                    </span>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-rose-600 font-bold">
                      Spent: {formatCurrency(month.totalSpent, currencySymbol, currencyCode)}
                    </span>
                    <span className="mx-1 text-slate-300">|</span>
                    <span className="text-emerald-600 font-bold">
                      Saved: {formatCurrency(month.totalSaved, currencySymbol, currencyCode)}
                    </span>
                  </div>
                </div>

                {/* Double Bar Graphic */}
                <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {/* Spent bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-400 w-12 shrink-0">Spent</span>
                    <div className="flex-1 bg-slate-200/60 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-rose-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${spentWidth}%` }}
                      />
                    </div>
                  </div>

                  {/* Saved bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-400 w-12 shrink-0">Saved</span>
                    <div className="flex-1 bg-slate-200/60 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${savedWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Category-Wise Difference Matrix */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="pb-4 border-b border-slate-100 mb-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Category Spending Comparison ({summaryA?.monthLabel.split(' ')[0]} vs {summaryB?.monthLabel.split(' ')[0]})
          </h3>
          <p className="text-xs text-slate-500">
            See where you spent more or saved more compared between the two selected months
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px] font-semibold">
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">{summaryA?.monthLabel}</th>
                <th className="py-2.5 px-3 text-right">{summaryB?.monthLabel}</th>
                <th className="py-2.5 px-3 text-right">Difference</th>
                <th className="py-2.5 px-3 text-right">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categoryDiffs.map(({ category, amountA, amountB, diff }) => {
                const isSaved = diff < 0;
                const isOver = diff > 0;

                return (
                  <tr key={category.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Category */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border"
                          style={{ 
                            backgroundColor: `${category.color}15`,
                            borderColor: `${category.color}30`,
                            color: category.color
                          }}
                        >
                          <CategoryIcon name={category.icon} className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800">{category.name}</span>
                          {category.hindiName && (
                            <span className="text-[11px] text-slate-400 ml-1.5 hidden md:inline">
                              {category.hindiName}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Month A */}
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      {formatCurrency(amountA, currencySymbol, currencyCode)}
                    </td>

                    {/* Month B */}
                    <td className="py-3 px-3 text-right text-slate-600">
                      {formatCurrency(amountB, currencySymbol, currencyCode)}
                    </td>

                    {/* Difference */}
                    <td className="py-3 px-3 text-right font-bold">
                      <span className={isSaved ? 'text-emerald-600' : isOver ? 'text-rose-600' : 'text-slate-500'}>
                        {diff > 0 ? '+' : ''}{formatCurrency(diff, currencySymbol, currencyCode)}
                      </span>
                    </td>

                    {/* Impact badge */}
                    <td className="py-3 px-3 text-right">
                      {isSaved ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Saved {formatCurrency(Math.abs(diff), currencySymbol, currencyCode)}!
                        </span>
                      ) : isOver ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                          +{formatCurrency(diff, currencySymbol, currencyCode)} Higher
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Equal</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Historical Table of All Months */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <h4 className="font-bold text-slate-800 text-sm mb-3">
          All Recorded Family Months Overview
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px] font-semibold">
                <th className="py-2 px-3">Month</th>
                <th className="py-2 px-3 text-right">Family Income</th>
                <th className="py-2 px-3 text-right">Total Spent</th>
                <th className="py-2 px-3 text-right">Total Saved</th>
                <th className="py-2 px-3 text-right">Savings Rate</th>
                <th className="py-2 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allMonthSummaries.map((m) => (
                <tr key={m.monthKey} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-800">{m.monthLabel}</td>
                  <td className="py-3 px-3 text-right text-slate-600">
                    {formatCurrency(m.totalIncome, currencySymbol, currencyCode)}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-rose-600">
                    {formatCurrency(m.totalSpent, currencySymbol, currencyCode)}
                  </td>
                  <td className="py-3 px-3 text-right font-extrabold text-emerald-600">
                    {formatCurrency(m.totalSaved, currencySymbol, currencyCode)}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-800">
                    {m.savingsRate.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-right">
                    {m.totalSaved >= m.targetSaved ? (
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-xs font-semibold">
                        Goal Hit 🎉
                      </span>
                    ) : (
                      <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-semibold">
                        Below Target
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
