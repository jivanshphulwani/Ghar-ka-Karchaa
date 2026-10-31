import { Expense, Category, FamilyConfig, MonthSummary, PaymentMode } from '../types/expense';
import { DEFAULT_CATEGORIES } from '../data/categories';
import { getDaysInMonth, getMonthLabel } from './formatters';

export const calculateMonthSummary = (
  monthKey: string,
  expenses: Expense[],
  config: FamilyConfig,
  categories: Category[] = DEFAULT_CATEGORIES
): MonthSummary => {
  const monthExpenses = expenses.filter(e => e.date.startsWith(monthKey));
  const daysInMonth = getDaysInMonth(monthKey);
  const totalIncome = config.monthlyIncome;
  const targetSaved = config.monthlySavingsTarget;

  const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSaved = totalIncome - totalSpent;
  const savingsRate = totalIncome > 0 ? (totalSaved / totalIncome) * 100 : 0;
  const isTargetMet = totalSaved >= targetSaved;

  // Determine elapsed days in month (if current month, don't divide by 30 if only 10 days have passed)
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  let divisorDays = daysInMonth;
  if (monthKey === currentMonthKey) {
    divisorDays = Math.max(1, now.getDate());
  }
  const dailyAverage = totalSpent / divisorDays;

  // Essential vs Discretionary
  let essentialSpent = 0;
  let discretionarySpent = 0;
  monthExpenses.forEach(e => {
    if (e.isEssential) {
      essentialSpent += e.amount;
    } else {
      discretionarySpent += e.amount;
    }
  });

  // Category breakdown
  const categoryMap = new Map<string, Category>();
  categories.forEach(c => categoryMap.set(c.id, c));

  const categorySpendMap: Record<string, number> = {};
  monthExpenses.forEach(e => {
    categorySpendMap[e.category] = (categorySpendMap[e.category] || 0) + e.amount;
  });

  const categoryBreakdown = categories
    .map(category => {
      const amount = categorySpendMap[category.id] || 0;
      const budget = config.categoryBudgets[category.id] ?? category.defaultBudget;
      const percentageOfSpend = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
      const percentageOfBudget = budget > 0 ? (amount / budget) * 100 : 0;
      const isOverBudget = budget > 0 && amount > budget;

      return {
        category,
        amount,
        budget,
        percentageOfSpend,
        percentageOfBudget,
        isOverBudget,
      };
    })
    .filter(item => item.amount > 0 || (item.budget > 0 && config.categoryBudgets[item.category.id] !== undefined))
    .sort((a, b) => b.amount - a.amount);

  // Member breakdown
  const memberSpendMap: Record<string, { amount: number; count: number }> = {};
  monthExpenses.forEach(e => {
    const member = e.familyMember || 'Shared / Joint';
    if (!memberSpendMap[member]) {
      memberSpendMap[member] = { amount: 0, count: 0 };
    }
    memberSpendMap[member].amount += e.amount;
    memberSpendMap[member].count += 1;
  });

  const memberBreakdown = Object.entries(memberSpendMap)
    .map(([member, data]) => ({
      member,
      amount: data.amount,
      percentage: totalSpent > 0 ? (data.amount / totalSpent) * 100 : 0,
      transactionCount: data.count,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Payment mode breakdown
  const paymentMap: Record<string, number> = {};
  monthExpenses.forEach(e => {
    paymentMap[e.paymentMode] = (paymentMap[e.paymentMode] || 0) + e.amount;
  });

  const paymentModeBreakdown = Object.entries(paymentMap).map(([mode, amount]) => ({
    mode: mode as PaymentMode,
    amount,
    percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
  }));

  // Daily breakdown
  const dailySpendMap: Record<number, { amount: number; count: number; date: string }> = {};
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = String(d).padStart(2, '0');
    const fullDate = `${monthKey}-${dStr}`;
    dailySpendMap[d] = { amount: 0, count: 0, date: fullDate };
  }

  monthExpenses.forEach(e => {
    const day = parseInt(e.date.split('-')[2], 10);
    if (dailySpendMap[day]) {
      dailySpendMap[day].amount += e.amount;
      dailySpendMap[day].count += 1;
    }
  });

  const [year, month] = monthKey.split('-').map(Number);
  const dailyBreakdown = Object.entries(dailySpendMap).map(([dayStr, data]) => {
    const dayNum = parseInt(dayStr, 10);
    const dateObj = new Date(year, month - 1, dayNum);
    const dayOfWeek = dateObj.toLocaleDateString('en-IN', { weekday: 'short' });
    return {
      date: data.date,
      dayNumber: dayNum,
      dayOfWeek,
      amount: data.amount,
      count: data.count,
    };
  });

  // Peak spending day
  let peakSpendingDay: { date: string; amount: number } | null = null;
  dailyBreakdown.forEach(day => {
    if (day.amount > 0 && (!peakSpendingDay || day.amount > peakSpendingDay.amount)) {
      peakSpendingDay = { date: day.date, amount: day.amount };
    }
  });

  return {
    monthKey,
    monthLabel: getMonthLabel(monthKey),
    totalIncome,
    totalSpent,
    totalSaved,
    savingsRate,
    targetSaved,
    isTargetMet,
    dailyAverage,
    totalTransactions: monthExpenses.length,
    essentialSpent,
    discretionarySpent,
    categoryBreakdown,
    memberBreakdown,
    paymentModeBreakdown,
    dailyBreakdown,
    peakSpendingDay,
  };
};

export interface SavingsHealth {
  title: string;
  hindiTitle: string;
  badgeClass: string;
  badgeText: string;
  description: string;
  emoji: string;
  colorHex: string;
}

export const evaluateSavingsHealth = (savingsRate: number, totalSaved: number): SavingsHealth => {
  if (totalSaved < 0) {
    return {
      title: 'Monthly Deficit Warning',
      hindiTitle: 'खर्च आमदनी से ज़्यादा (घाटा)',
      badgeClass: 'bg-red-500/10 text-red-700 border-red-300',
      badgeText: 'Deficit Alert',
      description: 'Expenses exceeded family income this month. Check discretionary spending like outside dining and unplanned shopping.',
      emoji: '🚨',
      colorHex: '#dc2626'
    };
  }

  if (savingsRate >= 30) {
    return {
      title: 'Outstanding Family Savings!',
      hindiTitle: 'शानदार बचत! परिवार का भविष्य सुरक्षित',
      badgeClass: 'bg-emerald-500/10 text-emerald-800 border-emerald-300',
      badgeText: 'Super Saver (30%+ Saved)',
      description: 'Excellent financial discipline! Over 30% of income is saved. Perfect for building emergency funds and SIP investments.',
      emoji: '🌟',
      colorHex: '#059669'
    };
  }

  if (savingsRate >= 20) {
    return {
      title: 'Healthy Middle-Class Savings',
      hindiTitle: 'संतुलित बजट और बढ़िया बचत',
      badgeClass: 'bg-teal-500/10 text-teal-800 border-teal-300',
      badgeText: 'Healthy Savings (20-30%)',
      description: 'Solid balance between daily household comfort and long-term security. Meets the classic 50-30-20 financial rule.',
      emoji: '👍',
      colorHex: '#0d9488'
    };
  }

  if (savingsRate >= 10) {
    return {
      title: 'Moderate Savings Margin',
      hindiTitle: 'साधारण बचत - थोड़ी और बचत संभव',
      badgeClass: 'bg-amber-500/10 text-amber-800 border-amber-300',
      badgeText: 'Moderate (10-20%)',
      description: 'You managed to save some money, but room for improvement exists in grocery deals, utility bills, or weekend outings.',
      emoji: '⚖️',
      colorHex: '#d97706'
    };
  }

  return {
    title: 'Tight Month - Borderline',
    hindiTitle: 'तंग बजट - बचत बहुत कम',
    badgeClass: 'bg-orange-500/10 text-orange-800 border-orange-300',
    badgeText: 'Tight Savings (<10%)',
    description: 'Less than 10% saved. High commitments or seasonal expenses reduced the family buffer this month.',
    emoji: '⚠️',
    colorHex: '#ea580c'
  };
};
