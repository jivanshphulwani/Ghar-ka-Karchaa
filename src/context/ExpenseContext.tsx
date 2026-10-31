import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Expense, FamilyConfig, MonthSummary } from '../types/expense';
import { DEFAULT_FAMILY_CONFIG, getInitialExpenses } from '../data/mockData';
import { DEFAULT_CATEGORIES } from '../data/categories';
import { calculateMonthSummary } from '../utils/calculations';
import { getAvailableMonths } from '../utils/formatters';

interface ExpenseContextType {
  expenses: Expense[];
  familyConfig: FamilyConfig;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  availableMonths: string[];
  currentMonthSummary: MonthSummary;
  allMonthSummaries: MonthSummary[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  batchAddExpenses: (expenses: Omit<Expense, 'id' | 'createdAt'>[]) => void;
  updateExpense: (id: string, updated: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  updateFamilyConfig: (newConfig: Partial<FamilyConfig>) => void;
  resetToSampleData: () => void;
  clearAllExpenses: () => void;
  exportDataJSON: () => void;
  importDataJSON: (jsonStr: string) => boolean;
}

const STORAGE_KEY_EXPENSES = 'gharkharch_family_expenses_v1';
const STORAGE_KEY_CONFIG = 'gharkharch_family_config_v1';

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load expenses from local storage or fallback to realistic initial data
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EXPENSES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return getInitialExpenses();
  });

  // Load family config
  const [familyConfig, setFamilyConfig] = useState<FamilyConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (stored) {
        return { ...DEFAULT_FAMILY_CONFIG, ...JSON.parse(stored) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_FAMILY_CONFIG;
  });

  // Determine current active month
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
    } catch (e) {
      console.error('Failed to save expenses to localStorage', e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(familyConfig));
    } catch (e) {
      console.error('Failed to save familyConfig to localStorage', e);
    }
  }, [familyConfig]);

  // Available months
  const availableMonths = useMemo(() => {
    const dates = expenses.map(e => e.date);
    return getAvailableMonths(dates);
  }, [expenses]);

  // Automatically ensure selected month is available or falls back gracefully
  useEffect(() => {
    if (availableMonths.length > 0 && !availableMonths.includes(selectedMonth)) {
      setSelectedMonth(availableMonths[0]);
    }
  }, [availableMonths, selectedMonth]);

  // Current Month Summary calculation
  const currentMonthSummary = useMemo(() => {
    return calculateMonthSummary(selectedMonth, expenses, familyConfig, DEFAULT_CATEGORIES);
  }, [selectedMonth, expenses, familyConfig]);

  // All months summaries for comparison
  const allMonthSummaries = useMemo(() => {
    return availableMonths.map(monthKey =>
      calculateMonthSummary(monthKey, expenses, familyConfig, DEFAULT_CATEGORIES)
    );
  }, [availableMonths, expenses, familyConfig]);

  const addExpense = (newExpenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...newExpenseData,
      id: 'exp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: Date.now(),
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const batchAddExpenses = (items: Omit<Expense, 'id' | 'createdAt'>[]) => {
    const newItems: Expense[] = items.map((item, idx) => ({
      ...item,
      id: 'exp-' + (Date.now() + idx) + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: Date.now() + idx,
    }));
    setExpenses(prev => [...newItems, ...prev]);
  };

  const updateExpense = (id: string, updated: Partial<Expense>) => {
    setExpenses(prev =>
      prev.map(exp => (exp.id === id ? { ...exp, ...updated } : exp))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const updateFamilyConfig = (newConfig: Partial<FamilyConfig>) => {
    setFamilyConfig(prev => ({ ...prev, ...newConfig }));
  };

  const resetToSampleData = () => {
    const samples = getInitialExpenses();
    setExpenses(samples);
    setFamilyConfig(DEFAULT_FAMILY_CONFIG);
    const m = getAvailableMonths(samples.map(s => s.date));
    if (m.length > 0) setSelectedMonth(m[0]);
  };

  const clearAllExpenses = () => {
    setExpenses([]);
  };

  const exportDataJSON = () => {
    const exportObject = {
      familyConfig,
      expenses,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${familyConfig.familyName.replace(/\s+/g, '_')}_expenses_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.expenses && Array.isArray(parsed.expenses)) {
        setExpenses(parsed.expenses);
        if (parsed.familyConfig) {
          setFamilyConfig(prev => ({ ...prev, ...parsed.familyConfig }));
        }
        return true;
      }
    } catch (e) {
      console.error('Failed to import JSON data', e);
    }
    return false;
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        familyConfig,
        selectedMonth,
        setSelectedMonth,
        availableMonths,
        currentMonthSummary,
        allMonthSummaries,
        addExpense,
        batchAddExpenses,
        updateExpense,
        deleteExpense,
        updateFamilyConfig,
        resetToSampleData,
        clearAllExpenses,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
