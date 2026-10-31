export const formatCurrency = (amount: number, symbol: string = '₹', code: string = 'INR'): string => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));

  let formattedNumber = '';
  if (code === 'INR' || symbol === '₹') {
    // Indian numbering format (Lakhs, Thousands): 1,23,456
    const str = absAmount.toString();
    if (str.length <= 3) {
      formattedNumber = str;
    } else {
      const lastThree = str.substring(str.length - 3);
      const otherNumbers = str.substring(0, str.length - 3);
      const withCommas = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
      formattedNumber = `${withCommas},${lastThree}`;
    }
  } else {
    formattedNumber = absAmount.toLocaleString('en-US');
  }

  return `${isNegative ? '-' : ''}${symbol}${formattedNumber}`;
};

export const formatDateDisplay = (dateString: string): string => {
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    // Check if today or yesterday
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(year, month - 1, day);
    
    const diffTime = today.getTime() - target.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays === -1) return 'Tomorrow';

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const getMonthLabel = (monthKey: string): string => {
  try {
    const [year, month] = monthKey.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  } catch {
    return monthKey;
  }
};

export const getDaysInMonth = (monthKey: string): number => {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month, 0).getDate();
};

export const getAvailableMonths = (dates: string[]): string[] => {
  const monthSet = new Set<string>();
  
  // Include current month
  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  monthSet.add(currentKey);

  dates.forEach(d => {
    if (d && d.length >= 7) {
      monthSet.add(d.substring(0, 7));
    }
  });

  return Array.from(monthSet).sort().reverse();
};
