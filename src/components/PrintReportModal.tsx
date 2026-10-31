import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/formatters';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentMonthSummary, familyConfig } = useExpense();
  const { currencySymbol, currencyCode, familyName } = familyConfig;

  if (!isOpen) return null;

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
  } = currentMonthSummary;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header - Not printed */}
        <div className="no-print bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Family Monthly Spending & Savings Statement
            </h3>
            <p className="text-xs text-slate-500">
              Printable summary for household family review ({monthLabel})
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Statement</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto text-slate-800 space-y-6">
          
          {/* Statement Header */}
          <div className="border-b-2 border-slate-800 pb-4 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {familyName}
              </h2>
              <div className="text-sm font-semibold text-emerald-800">
                GharKharch Monthly Household Financial Statement (घर खर्च विवरण)
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Statement Period: <strong>{monthLabel}</strong>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                {savingsRate.toFixed(1)}% Saved
              </span>
              <div className="text-[11px] text-slate-400 mt-1">
                Generated: {new Date().toLocaleDateString('en-IN')}
              </div>
            </div>
          </div>

          {/* Key Totals Box */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-500">Total Income</span>
              <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                {formatCurrency(totalIncome, currencySymbol, currencyCode)}
              </div>
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-rose-600">Total Spent</span>
              <div className="text-base sm:text-lg font-black text-rose-600 mt-0.5">
                {formatCurrency(totalSpent, currencySymbol, currencyCode)}
              </div>
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-emerald-600">Total Saved</span>
              <div className="text-base sm:text-lg font-black text-emerald-600 mt-0.5">
                {formatCurrency(totalSaved, currencySymbol, currencyCode)}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex justify-between items-center text-xs text-slate-600 border-b border-slate-200 pb-3">
            <span>Daily Average Spending: <strong>{formatCurrency(dailyAverage, currencySymbol, currencyCode)}</strong></span>
            <span>Essential Spends: <strong>{formatCurrency(essentialSpent, currencySymbol, currencyCode)}</strong></span>
            <span>Discretionary / Shauk: <strong>{formatCurrency(discretionarySpent, currencySymbol, currencyCode)}</strong></span>
            <span>Total Records: <strong>{totalTransactions}</strong></span>
          </div>

          {/* Category Table */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-2">
              Category Spending Breakdown
            </h4>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-300 font-semibold text-slate-500">
                  <th className="py-1.5">Category</th>
                  <th className="py-1.5 text-right">Budget</th>
                  <th className="py-1.5 text-right">Actual Spent</th>
                  <th className="py-1.5 text-right">% of Spending</th>
                  <th className="py-1.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categoryBreakdown.map((item) => (
                  <tr key={item.category.id}>
                    <td className="py-1.5 font-medium text-slate-800">
                      {item.category.name}
                    </td>
                    <td className="py-1.5 text-right text-slate-500">
                      {item.budget > 0 ? formatCurrency(item.budget, currencySymbol, currencyCode) : '-'}
                    </td>
                    <td className="py-1.5 text-right font-bold text-slate-900">
                      {formatCurrency(item.amount, currencySymbol, currencyCode)}
                    </td>
                    <td className="py-1.5 text-right text-slate-600">
                      {item.percentageOfSpend.toFixed(1)}%
                    </td>
                    <td className="py-1.5 text-right font-semibold">
                      {item.isOverBudget ? (
                        <span className="text-rose-600">Over Budget</span>
                      ) : (
                        <span className="text-emerald-700">Within Budget</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Member Split */}
          <div className="border-t border-slate-200 pt-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-2">
              Family Member Share
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {memberBreakdown.map(m => (
                <div key={m.member} className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="font-medium text-slate-600 truncate">{m.member}</div>
                  <div className="font-bold text-slate-900">
                    {formatCurrency(m.amount, currencySymbol, currencyCode)}
                  </div>
                  <div className="text-[10px] text-slate-400">({m.percentage.toFixed(1)}%)</div>
                </div>
              ))}
            </div>
          </div>

          {/* Signature / Notes Footer */}
          <div className="border-t-2 border-slate-200 pt-6 mt-6 flex justify-between text-xs text-slate-400">
            <div>
              <p>Family Financial Review Completed</p>
              <p className="font-medium text-slate-600 mt-4">Head of Household Signature</p>
            </div>
            <div className="text-right">
              <p>Savings verified & stored in family accounts</p>
              <p className="font-medium text-slate-600 mt-4">Approved by Family</p>
            </div>
          </div>

        </div>

        {/* Modal Footer - Not printed */}
        <div className="no-print bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
