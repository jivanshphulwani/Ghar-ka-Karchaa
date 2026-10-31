export type PaymentMode = 'UPI / Digital' | 'Cash' | 'Debit Card' | 'Credit Card' | 'Net Banking';

export interface Category {
  id: string;
  name: string;
  hindiName?: string;
  icon: string;
  color: string;
  bgLight: string;
  badgeColor: string;
  defaultBudget: number;
  isEssential: boolean;
  description: string;
}

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  category: string;
  description: string;
  familyMember: string;
  paymentMode: PaymentMode;
  isEssential: boolean;
  notes?: string;
  createdAt: number;
}

export interface FamilyConfig {
  familyName: string;
  currencySymbol: string;
  currencyCode: string;
  monthlyIncome: number;
  monthlySavingsTarget: number;
  members: string[];
  categoryBudgets: Record<string, number>;
}

export interface MonthSummary {
  monthKey: string; // e.g., '2026-10'
  monthLabel: string; // e.g., 'October 2026'
  totalIncome: number;
  totalSpent: number;
  totalSaved: number;
  savingsRate: number; // percentage
  targetSaved: number;
  isTargetMet: boolean;
  dailyAverage: number;
  totalTransactions: number;
  essentialSpent: number;
  discretionarySpent: number;
  categoryBreakdown: {
    category: Category;
    amount: number;
    budget: number;
    percentageOfSpend: number;
    percentageOfBudget: number;
    isOverBudget: boolean;
  }[];
  memberBreakdown: {
    member: string;
    amount: number;
    percentage: number;
    transactionCount: number;
  }[];
  paymentModeBreakdown: {
    mode: PaymentMode;
    amount: number;
    percentage: number;
  }[];
  dailyBreakdown: {
    date: string;
    dayNumber: number;
    dayOfWeek: string;
    amount: number;
    count: number;
  }[];
  peakSpendingDay: {
    date: string;
    amount: number;
  } | null;
}
