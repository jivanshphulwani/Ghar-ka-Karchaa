import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Calendar, 
  Receipt, 
  Sparkles, 
  User, 
  CreditCard,
  CheckCircle2,
  X,
  ArrowUpDown
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { DEFAULT_CATEGORIES, QUICK_PRESETS } from '../data/categories';
import { Expense, PaymentMode } from '../types/expense';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface DailyExpensesViewProps {
  onOpenAddModal: () => void;
  onEditExpense: (expense: Expense) => void;
}

export const DailyExpensesView: React.FC<DailyExpensesViewProps> = ({
  onOpenAddModal,
  onEditExpense,
}) => {
  const { 
    expenses, 
    familyConfig, 
    selectedMonth, 
    addExpense, 
    deleteExpense 
  } = useExpense();

  const { currencySymbol, currencyCode } = familyConfig;

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Inline Quick Add State
  const [quickAmount, setQuickAmount] = useState('');
  const [quickDesc, setQuickDesc] = useState('');
  const [quickCategory, setQuickCategory] = useState('groceries');
  const [quickMember, setQuickMember] = useState(familyConfig.members[0] || 'Father (Papa)');
  const [quickPaymentMode, setQuickPaymentMode] = useState<PaymentMode>('UPI / Digital');
  const [quickIsEssential, setQuickIsEssential] = useState(true);
  const [quickDate, setQuickDate] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  });

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(quickAmount);
    if (!amountNum || amountNum <= 0) return;

    addExpense({
      date: quickDate,
      amount: amountNum,
      category: quickCategory,
      description: quickDesc.trim() || DEFAULT_CATEGORIES.find(c => c.id === quickCategory)?.name || 'Daily Expense',
      familyMember: quickMember,
      paymentMode: quickPaymentMode,
      isEssential: quickIsEssential,
      notes: ''
    });

    setQuickAmount('');
    setQuickDesc('');
  };

  const applyPreset = (preset: typeof QUICK_PRESETS[0]) => {
    setQuickAmount(preset.amount.toString());
    setQuickDesc(preset.label);
    setQuickCategory(preset.category);
    setQuickIsEssential(preset.isEssential);
  };

  // Filter expenses for currently selected month
  const monthExpenses = useMemo(() => {
    return expenses.filter(e => e.date.startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  // Apply search and filter
  const filteredExpenses = useMemo(() => {
    let result = monthExpenses.filter(e => {
      const matchSearch = searchTerm === '' || 
        e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.notes && e.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        e.familyMember.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCat = selectedCategory === 'all' || e.category === selectedCategory;
      const matchMember = selectedMember === 'all' || e.familyMember === selectedMember;
      const matchMode = selectedPaymentMode === 'all' || e.paymentMode === selectedPaymentMode;

      return matchSearch && matchCat && matchMember && matchMode;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        const dateDiff = b.date.localeCompare(a.date);
        if (dateDiff !== 0) return dateDiff;
        return (b.createdAt || 0) - (a.createdAt || 0);
      }
      if (sortBy === 'amount-desc') {
        return b.amount - a.amount;
      }
      if (sortBy === 'amount-asc') {
        return a.amount - b.amount;
      }
      return 0;
    });

    return result;
  }, [monthExpenses, searchTerm, selectedCategory, selectedMember, selectedPaymentMode, sortBy]);

  // Group by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, { date: string; items: Expense[]; total: number }> = {};
    
    filteredExpenses.forEach(exp => {
      if (!groups[exp.date]) {
        groups[exp.date] = { date: exp.date, items: [], total: 0 };
      }
      groups[exp.date].items.push(exp);
      groups[exp.date].total += exp.amount;
    });

    // Keep chronological order of the dates
    return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
  }, [filteredExpenses]);

  const totalFilteredAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const activeCategoryObj = DEFAULT_CATEGORIES.find(c => c.id === quickCategory);

  return (
    <div className="space-y-6">
      
      {/* 1. Quick Daily Spending Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              +
            </span>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              Quick Enter Today's Spending (आज का खर्च जोड़ें)
            </h3>
          </div>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Detailed Entry Form</span>
            <span>&rarr;</span>
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-3 text-xs">
          <span className="text-slate-400 font-medium whitespace-nowrap text-[11px] mr-1">
            Presets:
          </span>
          {QUICK_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-slate-200 rounded-lg text-slate-600 transition-colors whitespace-nowrap cursor-pointer text-xs"
            >
              {preset.label} <span className="font-bold">{currencySymbol}{preset.amount}</span>
            </button>
          ))}
        </div>

        {/* Inline Form */}
        <form onSubmit={handleQuickAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          {/* Amount */}
          <div className="sm:col-span-3 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
              {currencySymbol}
            </span>
            <input
              type="number"
              step="any"
              min="1"
              required
              placeholder="Amount (रुपये)"
              value={quickAmount}
              onChange={(e) => setQuickAmount(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-3">
            <input
              type="text"
              placeholder="What was it for? (e.g. Sabzi, Petrol)"
              value={quickDesc}
              onChange={(e) => setQuickDesc(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-2">
            <select
              value={quickCategory}
              onChange={(e) => {
                setQuickCategory(e.target.value);
                const cat = DEFAULT_CATEGORIES.find(c => c.id === e.target.value);
                if (cat) setQuickIsEssential(cat.isEssential);
              }}
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {DEFAULT_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Family Member */}
          <div className="sm:col-span-2">
            <select
              value={quickMember}
              onChange={(e) => setQuickMember(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {familyConfig.members.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2 flex items-center gap-1.5">
            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs sm:text-sm transition-colors shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Record</span>
            </button>
          </div>
        </form>

        {/* Quick Options Line: Date, Mode, Essential */}
        <div className="flex flex-wrap items-center gap-3 mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={quickDate}
              onChange={(e) => setQuickDate(e.target.value)}
              className="text-xs bg-transparent border-0 font-medium text-slate-700 focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={quickPaymentMode}
              onChange={(e) => setQuickPaymentMode(e.target.value as PaymentMode)}
              className="text-xs bg-transparent border-0 font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="UPI / Digital">UPI / PhonePe / GPay</option>
              <option value="Cash">Cash (नकद)</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Net Banking">Net Banking</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer ml-auto select-none">
            <input
              type="checkbox"
              checked={quickIsEssential}
              onChange={(e) => setQuickIsEssential(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="font-medium text-slate-600">
              Essential Need (ज़रूरी खर्च)
            </span>
          </label>
        </div>
      </div>

      {/* 2. Filters & Search Section */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by description, shop, member..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Categories ({DEFAULT_CATEGORIES.length})</option>
              {DEFAULT_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Member Filter */}
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Members</option>
              {familyConfig.members.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* Payment Mode */}
            <select
              value={selectedPaymentMode}
              onChange={(e) => setSelectedPaymentMode(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Payment Modes</option>
              <option value="UPI / Digital">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Net Banking">Net Banking</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="amount-desc">Amount (Highest First)</option>
              <option value="amount-asc">Amount (Lowest First)</option>
            </select>
          </div>
        </div>

        {/* Quick summary of filter */}
        <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{filteredExpenses.length}</strong> transactions
          </span>
          <span>
            Total in selection: <strong className="text-emerald-700 font-bold">{formatCurrency(totalFilteredAmount, currencySymbol, currencyCode)}</strong>
          </span>
        </div>
      </div>

      {/* 3. Daily Grouped Spending Records List */}
      <div className="space-y-4">
        {groupedByDate.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center">
            <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-700 text-base">No Spending Records Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              No transactions match your current search or filters for this month. You can enter an amount above!
            </p>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              + Enter Daily Expense
            </button>
          </div>
        ) : (
          groupedByDate.map((group) => {
            const dateDisplay = formatDateDisplay(group.date);
            return (
              <div 
                key={group.date}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs"
              >
                {/* Daily Group Header */}
                <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-xs sm:text-sm text-slate-800">
                      {dateDisplay}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                      ({group.date})
                    </span>
                    <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                      {group.items.length} {group.items.length === 1 ? 'record' : 'records'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 font-medium">Day Total:</span>
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                      {formatCurrency(group.total, currencySymbol, currencyCode)}
                    </span>
                  </div>
                </div>

                {/* Items in Day */}
                <div className="divide-y divide-slate-100">
                  {group.items.map((item) => {
                    const cat = DEFAULT_CATEGORIES.find(c => c.id === item.category);

                    return (
                      <div
                        key={item.id}
                        className="p-3 sm:p-4 hover:bg-slate-50/70 transition flex items-center justify-between gap-3 group"
                      >
                        {/* Left: Icon & Details */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div 
                            className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border"
                            style={{ 
                              backgroundColor: `${cat?.color || '#059669'}15`,
                              borderColor: `${cat?.color || '#059669'}30`,
                              color: cat?.color || '#059669'
                            }}
                          >
                            <CategoryIcon name={cat?.icon || 'ShoppingCart'} className="w-5 h-5" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                                {item.description}
                              </h4>
                              {cat && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${cat.badgeColor}`}>
                                  {cat.name}
                                </span>
                              )}
                              {item.isEssential ? (
                                <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-medium">
                                  Essential
                                </span>
                              ) : (
                                <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-medium">
                                  Discretionary
                                </span>
                              )}
                            </div>

                            {/* Sub details: member, payment mode, notes */}
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 flex-wrap">
                              <span className="flex items-center gap-1 font-medium text-slate-600">
                                <User className="w-3 h-3 text-slate-400" />
                                {item.familyMember}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-slate-500">
                                <CreditCard className="w-3 h-3 text-slate-400" />
                                {item.paymentMode}
                              </span>
                              {item.notes && (
                                <>
                                  <span>•</span>
                                  <span className="italic text-slate-400 truncate max-w-xs">
                                    "{item.notes}"
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Amount & Action Buttons */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="font-bold text-sm sm:text-base text-slate-900">
                              {formatCurrency(item.amount, currencySymbol, currencyCode)}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => onEditExpense(item)}
                              className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Expense"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete "${item.description}" (${currencySymbol}${item.amount})?`)) {
                                  deleteExpense(item.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Expense"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
