import { Category } from '../types/expense';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'groceries',
    name: 'Groceries & Ration',
    hindiName: 'राशन / किराना',
    icon: 'ShoppingCart',
    color: '#16a34a',
    bgLight: 'bg-emerald-50',
    badgeColor: 'text-emerald-700 bg-emerald-100 border-emerald-200',
    defaultBudget: 12000,
    isEssential: true,
    description: 'Flour, rice, pulses, cooking oil, spices, and monthly kitchen supplies'
  },
  {
    id: 'dairy',
    name: 'Milk & Daily Dairy',
    hindiName: 'दूध और नाश्ता',
    icon: 'Milk',
    color: '#0284c7',
    bgLight: 'bg-sky-50',
    badgeColor: 'text-sky-700 bg-sky-100 border-sky-200',
    defaultBudget: 3500,
    isEssential: true,
    description: 'Daily fresh milk, curd, paneer, eggs, bread and morning essentials'
  },
  {
    id: 'veggies',
    name: 'Vegetables & Fruits',
    hindiName: 'फल और सब्ज़ी मंडी',
    icon: 'Apple',
    color: '#65a30d',
    bgLight: 'bg-lime-50',
    badgeColor: 'text-lime-700 bg-lime-100 border-lime-200',
    defaultBudget: 4000,
    isEssential: true,
    description: 'Fresh vegetables, green leafy veggies, seasonal fruits'
  },
  {
    id: 'bills',
    name: 'Bills & Utilities',
    hindiName: 'बिजली, गैस, वाई-फाई बिल',
    icon: 'Zap',
    color: '#ea580c',
    bgLight: 'bg-orange-50',
    badgeColor: 'text-orange-700 bg-orange-100 border-orange-200',
    defaultBudget: 5500,
    isEssential: true,
    description: 'Electricity bill, Gas cylinder/PNG, Internet/Wi-Fi, mobile recharges, water'
  },
  {
    id: 'rent_emi',
    name: 'Rent & Home EMI',
    hindiName: 'मकान किराया / ईएमआई',
    icon: 'Home',
    color: '#7c3aed',
    bgLight: 'bg-purple-50',
    badgeColor: 'text-purple-700 bg-purple-100 border-purple-200',
    defaultBudget: 15000,
    isEssential: true,
    description: 'Monthly flat/house rent or home loan installment'
  },
  {
    id: 'education',
    name: 'Children & Education',
    hindiName: 'बच्चों की फीस व पढ़ाई',
    icon: 'GraduationCap',
    color: '#2563eb',
    bgLight: 'bg-blue-50',
    badgeColor: 'text-blue-700 bg-blue-100 border-blue-200',
    defaultBudget: 8000,
    isEssential: true,
    description: 'School/College fees, coaching classes, books, stationary, uniform'
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Medicines',
    hindiName: 'दवाई और डॉक्टर',
    icon: 'HeartPulse',
    color: '#dc2626',
    bgLight: 'bg-red-50',
    badgeColor: 'text-red-700 bg-red-100 border-red-200',
    defaultBudget: 3500,
    isEssential: true,
    description: 'Prescription medicines for parents/kids, doctor visits, health tests'
  },
  {
    id: 'commute',
    name: 'Fuel & Commute',
    hindiName: 'पेट्रोल और यात्रा',
    icon: 'Fuel',
    color: '#d97706',
    bgLight: 'bg-amber-50',
    badgeColor: 'text-amber-700 bg-amber-100 border-amber-200',
    defaultBudget: 5000,
    isEssential: true,
    description: 'Two-wheeler / car petrol, diesel, auto-rickshaw, metro/bus pass'
  },
  {
    id: 'househelp',
    name: 'Maid & Home Maintenance',
    hindiName: 'कामवाली बाई व मरम्मत',
    icon: 'Wrench',
    color: '#475569',
    bgLight: 'bg-slate-50',
    badgeColor: 'text-slate-700 bg-slate-100 border-slate-200',
    defaultBudget: 3000,
    isEssential: true,
    description: 'Domestic helper salary, plumber, electrician, appliance servicing'
  },
  {
    id: 'dining',
    name: 'Dining Out & Treats',
    hindiName: 'बाहर का खाना व नाश्ता',
    icon: 'UtensilsCrossed',
    color: '#f43f5e',
    bgLight: 'bg-rose-50',
    badgeColor: 'text-rose-700 bg-rose-100 border-rose-200',
    defaultBudget: 3000,
    isEssential: false,
    description: 'Family weekend dinner, street food snacks, sweet box, tea stall'
  },
  {
    id: 'personal',
    name: 'Personal & Clothing',
    hindiName: 'कपड़े और व्यक्तिगत खर्च',
    icon: 'Shirt',
    color: '#8b5cf6',
    bgLight: 'bg-violet-50',
    badgeColor: 'text-violet-700 bg-violet-100 border-violet-200',
    defaultBudget: 3500,
    isEssential: false,
    description: 'Festive clothes, footwear, salon, haircut, toiletries'
  },
  {
    id: 'misc',
    name: 'Family Misc & Gifts',
    hindiName: 'शगुन व अन्य खर्चे',
    icon: 'Gift',
    color: '#64748b',
    bgLight: 'bg-zinc-50',
    badgeColor: 'text-zinc-700 bg-zinc-100 border-zinc-200',
    defaultBudget: 2500,
    isEssential: false,
    description: 'Family ceremonies, shagun, temple charity, unexpected expenses'
  }
];

export const DEFAULT_MEMBERS = ['Father (Papa)', 'Mother (Mummy)', 'Elder Son / Daughter', 'Shared Family Pool'];

export const QUICK_PRESETS = [
  { label: 'Milk (1L)', amount: 66, category: 'dairy', isEssential: true },
  { label: 'Fresh Veggies', amount: 180, category: 'veggies', isEssential: true },
  { label: 'Petrol Top-up', amount: 300, category: 'commute', isEssential: true },
  { label: 'Bread & Eggs', amount: 110, category: 'dairy', isEssential: true },
  { label: 'Medicines', amount: 240, category: 'healthcare', isEssential: true },
  { label: 'Evening Snacks / Chaat', amount: 150, category: 'dining', isEssential: false },
  { label: 'Mobile Recharge', amount: 299, category: 'bills', isEssential: true },
  { label: 'Grocery Items', amount: 650, category: 'groceries', isEssential: true },
];
