import React from 'react';
import { 
  PlusCircle, 
  Settings, 
  Printer, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Users,
  Coins
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { getMonthLabel } from '../utils/formatters';

interface HeaderProps {
  activeTab: 'daily' | 'monthEnd' | 'compare';
  setActiveTab: (tab: 'daily' | 'monthEnd' | 'compare') => void;
  onOpenAddModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenReportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenSettingsModal,
  onOpenReportModal,
}) => {
  const { 
    familyConfig, 
    selectedMonth, 
    setSelectedMonth, 
    availableMonths,
    updateFamilyConfig
  } = useExpense();

  // Month navigation helpers
  const currentMonthIdx = availableMonths.indexOf(selectedMonth);
  const hasOlderMonth = currentMonthIdx !== -1 && currentMonthIdx < availableMonths.length - 1;
  const hasNewerMonth = currentMonthIdx !== -1 && currentMonthIdx > 0;

  const goToOlderMonth = () => {
    if (hasOlderMonth) {
      setSelectedMonth(availableMonths[currentMonthIdx + 1]);
    }
  };

  const goToNewerMonth = () => {
    if (hasNewerMonth) {
      setSelectedMonth(availableMonths[currentMonthIdx - 1]);
    }
  };

  const handleCurrencyChange = (newSymbol: string, newCode: string) => {
    updateFamilyConfig({ currencySymbol: newSymbol, currencyCode: newCode });
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          
          {/* Logo & Family Title */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-100">
              <Coins className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">GharKharch</h1>
                <span className="text-xs px-2 py-0.5 font-medium rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  घर खर्च
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                  <Users className="w-3 h-3 text-slate-400" />
                  {familyConfig.familyName}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Middle-Class Daily Spends, Month-End Total & Savings Tracker
              </p>
            </div>
          </div>

          {/* Month Selector & Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Month Navigator */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={goToOlderMonth}
                disabled={!hasOlderMonth}
                aria-label="Previous Month"
                className={`p-1.5 rounded-lg text-slate-600 transition-colors ${
                  hasOlderMonth ? 'hover:bg-white hover:text-slate-900 shadow-2xs cursor-pointer' : 'opacity-30 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 px-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent font-semibold text-xs sm:text-sm text-slate-800 focus:outline-none cursor-pointer pr-1"
                >
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>
                      {getMonthLabel(m)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={goToNewerMonth}
                disabled={!hasNewerMonth}
                aria-label="Next Month"
                className={`p-1.5 rounded-lg text-slate-600 transition-colors ${
                  hasNewerMonth ? 'hover:bg-white hover:text-slate-900 shadow-2xs cursor-pointer' : 'opacity-30 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Currency Picker Quick Select */}
            <div className="relative">
              <select
                value={`${familyConfig.currencySymbol}|${familyConfig.currencyCode}`}
                onChange={(e) => {
                  const [sym, code] = e.target.value.split('|');
                  handleCurrencyChange(sym, code);
                }}
                className="text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                title="Select Currency"
              >
                <option value="₹|INR">₹ INR (Rupees)</option>
                <option value="$|USD">$ USD (Dollars)</option>
                <option value="€|EUR">€ EUR (Euros)</option>
                <option value="£|GBP">£ GBP (Pounds)</option>
                <option value="AED|AED">AED (Dirhams)</option>
                <option value="৳|BDT">৳ BDT (Taka)</option>
                <option value="Rs|PKR">Rs PKR (Rupees)</option>
              </select>
            </div>

            {/* Action Buttons */}
            <button
              type="button"
              onClick={onOpenReportModal}
              title="Print Monthly Family Summary Report"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenSettingsModal}
              title="Configure Monthly Income & Category Budgets"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Enter Daily Spend</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="flex border-t border-slate-100 pt-1 -mb-px space-x-1 sm:space-x-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('daily')}
            className={`py-2.5 px-3 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'daily'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Daily Spending Records</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('monthEnd')}
            className={`py-2.5 px-3 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'monthEnd'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Month-End Total & Savings</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              Full Breakdown
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('compare')}
            className={`py-2.5 px-3 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'compare'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Compare Every Month</span>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              Monthly Diff
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
