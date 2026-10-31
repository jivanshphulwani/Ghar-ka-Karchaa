import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  User, 
  CreditCard, 
  Tag, 
  FileText, 
  Check, 
  HelpCircle,
  Plus
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { DEFAULT_CATEGORIES, QUICK_PRESETS } from '../data/categories';
import { Expense, PaymentMode } from '../types/expense';
import { CategoryIcon } from './CategoryIcon';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingExpense: Expense | null;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  editingExpense,
}) => {
  const { familyConfig, addExpense, updateExpense } = useExpense();
  const { currencySymbol } = familyConfig;

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('groceries');
  const [familyMember, setFamilyMember] = useState(familyConfig.members[0] || 'Father (Papa)');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI / Digital');
  const [isEssential, setIsEssential] = useState(true);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  // Populate when editing
  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount.toString());
      setDescription(editingExpense.description);
      setCategory(editingExpense.category);
      setFamilyMember(editingExpense.familyMember);
      setPaymentMode(editingExpense.paymentMode);
      setIsEssential(editingExpense.isEssential);
      setDate(editingExpense.date);
      setNotes(editingExpense.notes || '');
    } else {
      // Defaults
      setAmount('');
      setDescription('');
      setCategory('groceries');
      setFamilyMember(familyConfig.members[0] || 'Father (Papa)');
      setPaymentMode('UPI / Digital');
      setIsEssential(true);
      setDate(new Date().toISOString().slice(0, 10));
      setNotes('');
    }
  }, [editingExpense, isOpen, familyConfig]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const finalDescription = description.trim() || DEFAULT_CATEGORIES.find(c => c.id === category)?.name || 'Daily Expense';

    if (editingExpense) {
      updateExpense(editingExpense.id, {
        amount: parsedAmount,
        description: finalDescription,
        category,
        familyMember,
        paymentMode,
        isEssential,
        date,
        notes: notes.trim(),
      });
    } else {
      addExpense({
        amount: parsedAmount,
        description: finalDescription,
        category,
        familyMember,
        paymentMode,
        isEssential,
        date,
        notes: notes.trim(),
      });
    }

    onClose();
  };

  const applyPreset = (p: typeof QUICK_PRESETS[0]) => {
    setAmount(p.amount.toString());
    setDescription(p.label);
    setCategory(p.category);
    setIsEssential(p.isEssential);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden transform transition-all my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              {editingExpense ? 'Edit Spending Record' : 'Record Daily Expense (दैनिक खर्च)'}
            </h3>
            <p className="text-xs text-slate-500">
              {editingExpense ? 'Modify details of this household spend' : 'Enter amount, category and who paid'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Quick Presets (Only when adding new) */}
          {!editingExpense && (
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Quick Fill Frequent Spends:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PRESETS.slice(0, 6).map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-slate-200 rounded-lg text-slate-700 transition cursor-pointer font-medium"
                  >
                    {p.label} ({currencySymbol}{p.amount})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Amount Input (Huge Focus) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Expense Amount ({currencySymbol}) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="any"
                min="0.5"
                required
                autoFocus
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-2xl font-black text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description / What was it for? *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sabzi Mandi, Cooking Gas cylinder, Milk bill, Petrol"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
            />
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category (श्रेणी) *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEFAULT_CATEGORIES.map(c => {
                const isSelected = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setCategory(c.id);
                      setIsEssential(c.isEssential);
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer text-xs ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ 
                        backgroundColor: `${c.color}20`,
                        color: c.color
                      }}
                    >
                      <CategoryIcon name={c.icon} className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <div className="truncate">{c.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row: Date & Family Member */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Expense Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Paid By (किसने भुगतान किया) *
              </label>
              <select
                value={familyMember}
                onChange={(e) => setFamilyMember(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {familyConfig.members.map(m => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row: Payment Mode & Essential Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Payment Mode *
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="UPI / Digital">UPI / PhonePe / GPay</option>
                <option value="Cash">Cash (नकद)</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Need vs Want
              </label>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden p-0.5 bg-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEssential(true)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    isEssential 
                      ? 'bg-emerald-600 text-white shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Essential (ज़रूरी)
                </button>
                <button
                  type="button"
                  onClick={() => setIsEssential(false)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    !isEssential 
                      ? 'bg-amber-600 text-white shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Discretionary (शौक)
                </button>
              </div>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Additional Notes / Shop Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Gupta Ji Ki Dukan, Bill receipt #1234"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{editingExpense ? 'Save Changes' : 'Save Spending'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
