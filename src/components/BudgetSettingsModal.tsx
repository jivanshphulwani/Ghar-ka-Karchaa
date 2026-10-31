import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Wallet, 
  Target, 
  Users, 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2, 
  Check, 
  Plus, 
  AlertTriangle 
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { DEFAULT_CATEGORIES } from '../data/categories';
import { formatCurrency } from '../utils/formatters';

interface BudgetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BudgetSettingsModal: React.FC<BudgetSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    familyConfig, 
    updateFamilyConfig, 
    resetToSampleData, 
    clearAllExpenses,
    exportDataJSON,
    importDataJSON 
  } = useExpense();

  const [activeTab, setActiveTab] = useState<'income' | 'categories' | 'members' | 'data'>('income');

  // Form states
  const [familyName, setFamilyName] = useState(familyConfig.familyName);
  const [monthlyIncome, setMonthlyIncome] = useState(familyConfig.monthlyIncome.toString());
  const [monthlySavingsTarget, setMonthlySavingsTarget] = useState(familyConfig.monthlySavingsTarget.toString());
  const [currencySymbol, setCurrencySymbol] = useState(familyConfig.currencySymbol);
  const [currencyCode, setCurrencyCode] = useState(familyConfig.currencyCode);
  const [members, setMembers] = useState<string[]>(familyConfig.members);
  const [newMemberName, setNewMemberName] = useState('');
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>({
    ...familyConfig.categoryBudgets,
  });

  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateFamilyConfig({
      familyName: familyName.trim() || 'My Family',
      monthlyIncome: Math.max(0, parseFloat(monthlyIncome) || 0),
      monthlySavingsTarget: Math.max(0, parseFloat(monthlySavingsTarget) || 0),
      currencySymbol,
      currencyCode,
      members: members.filter(m => m.trim().length > 0),
      categoryBudgets,
    });
    onClose();
  };

  const handleAddMember = () => {
    if (newMemberName.trim() && !members.includes(newMemberName.trim())) {
      setMembers([...members, newMemberName.trim()]);
      setNewMemberName('');
    }
  };

  const handleRemoveMember = (name: string) => {
    if (members.length <= 1) return;
    setMembers(members.filter(m => m !== name));
  };

  const handleBudgetChange = (catId: string, val: string) => {
    const num = parseFloat(val) || 0;
    setCategoryBudgets(prev => ({ ...prev, [catId]: num }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataJSON(content);
      if (success) {
        setImportStatus('Data successfully restored!');
        setTimeout(() => {
          setImportStatus(null);
          onClose();
        }, 1500);
      } else {
        setImportStatus('Failed to import: Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  // Calculate sum of category budgets
  const totalBudgetsAllocated = Object.values(categoryBudgets).reduce((a, b) => a + b, 0);
  const parsedIncome = parseFloat(monthlyIncome) || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Family Budget & Income Settings
              </h3>
              <p className="text-xs text-slate-500">
                Configure salary, target savings & category limits
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inner Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setActiveTab('income')}
            className={`py-2.5 px-3 border-b-2 text-xs font-bold cursor-pointer transition ${
              activeTab === 'income'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Income & Savings Goal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`py-2.5 px-3 border-b-2 text-xs font-bold cursor-pointer transition ${
              activeTab === 'categories'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Category Budgets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('members')}
            className={`py-2.5 px-3 border-b-2 text-xs font-bold cursor-pointer transition ${
              activeTab === 'members'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Family Members
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('data')}
            className={`py-2.5 px-3 border-b-2 text-xs font-bold cursor-pointer transition ${
              activeTab === 'data'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Backup & Reset
          </button>
        </div>

        {/* Body Content */}
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* Tab 1: Income & Savings Target */}
          {activeTab === 'income' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Family / Household Name
                </label>
                <input
                  type="text"
                  required
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="e.g. Sharma Family, Verma Household"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Monthly In-hand Income / Salary ({currencySymbol}) *
                </label>
                <p className="text-[11px] text-slate-400 mb-1">
                  Total in-hand take-home salary or family earnings every month.
                </p>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-base">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    required
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-black text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Monthly Family Savings Target ({currencySymbol}) *
                </label>
                <p className="text-[11px] text-slate-400 mb-1">
                  How much does the family aim to save each month (FD, SIP, emergency fund, kids' future)?
                </p>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-emerald-600 text-base">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    required
                    value={monthlySavingsTarget}
                    onChange={(e) => setMonthlySavingsTarget(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-emerald-50/50 border-2 border-emerald-200 rounded-xl text-lg font-black text-emerald-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                {parsedIncome > 0 && (
                  <div className="text-[11px] text-slate-500 mt-1.5">
                    Target is <strong>{((parseFloat(monthlySavingsTarget) || 0) / parsedIncome * 100).toFixed(1)}%</strong> of monthly earnings.
                  </div>
                )}
              </div>

              {/* Currency Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Currency Symbol & Code
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    placeholder="Symbol (e.g. ₹)"
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:outline-none"
                  />
                  <input
                    type="text"
                    value={currencyCode}
                    onChange={(e) => setCurrencyCode(e.target.value.toUpperCase())}
                    placeholder="Code (e.g. INR)"
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Category Budgets */}
          {activeTab === 'categories' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span>Total Allocated Budgets:</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(totalBudgetsAllocated, currencySymbol, currencyCode)}
                </span>
              </div>

              <div className="space-y-2.5">
                {DEFAULT_CATEGORIES.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{cat.name}</div>
                      {cat.hindiName && (
                        <div className="text-[10px] text-slate-400">{cat.hindiName}</div>
                      )}
                    </div>
                    <div className="relative w-32 shrink-0">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        {currencySymbol}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={categoryBudgets[cat.id] ?? cat.defaultBudget}
                        onChange={(e) => handleBudgetChange(cat.id, e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-right text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Family Members */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Track which family member made the daily purchase (Papa, Mummy, Kids, Grandparents).
              </p>

              {/* Add member input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="New member name (e.g. Grandma, Pooja, Amit)"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>

              {/* Members List */}
              <div className="space-y-2">
                {members.map(m => (
                  <div key={m} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
                    <span className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {m}
                    </span>
                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(m)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded cursor-pointer"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Backup & Reset */}
          {activeTab === 'data' && (
            <div className="space-y-4">
              {importStatus && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${
                  importStatus.includes('success') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {importStatus}
                </div>
              )}

              {/* Backup Export */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <h5 className="font-bold text-xs text-slate-800 mb-1">Export Family Records Backup</h5>
                <p className="text-[11px] text-slate-500 mb-2.5">
                  Save all monthly spending and savings records to an offline JSON file.
                </p>
                <button
                  type="button"
                  onClick={exportDataJSON}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Backup File</span>
                </button>
              </div>

              {/* Restore Import */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <h5 className="font-bold text-xs text-slate-800 mb-1">Restore from Backup</h5>
                <p className="text-[11px] text-slate-500 mb-2.5">
                  Import previously saved JSON file to restore all family expenses.
                </p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose JSON File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Sample Data Reset */}
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                <h5 className="font-bold text-xs text-emerald-900 mb-1">Load Middle-Class Sample Data</h5>
                <p className="text-[11px] text-emerald-700 mb-2.5">
                  Populate 3 months of realistic household transactions (Groceries, Milk, Gas, Rent, School, Doctor) to preview all features.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset to realistic middle class sample records?')) {
                      resetToSampleData();
                      onClose();
                    }
                  }}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Load Sample Records</span>
                </button>
              </div>

              {/* Clear All Data */}
              <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-xl">
                <h5 className="font-bold text-xs text-rose-900 mb-1">Clear All Expenses (Fresh Slate)</h5>
                <p className="text-[11px] text-rose-700 mb-2.5">
                  Deletes all recorded expenses so you can start completely from scratch.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete ALL expense records? This cannot be undone.')) {
                      clearAllExpenses();
                      onClose();
                    }
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Records</span>
                </button>
              </div>

            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
