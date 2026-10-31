/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import { Header } from './components/Header';
import { MonthlySavingsHero } from './components/MonthlySavingsHero';
import { DailyExpensesView } from './components/DailyExpensesView';
import { MonthEndAnalysis } from './components/MonthEndAnalysis';
import { MonthComparisonView } from './components/MonthComparisonView';
import { ExpenseModal } from './components/ExpenseModal';
import { BudgetSettingsModal } from './components/BudgetSettingsModal';
import { PrintReportModal } from './components/PrintReportModal';
import { Expense } from './types/expense';
import { ShieldCheck, Heart, Sparkles, TrendingUp, Calendar, Coins } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'daily' | 'monthEnd' | 'compare'>('daily');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsAddModalOpen(true);
  };

  const handleCloseExpenseModal = () => {
    setIsAddModalOpen(false);
    setEditingExpense(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => {
          setEditingExpense(null);
          setIsAddModalOpen(true);
        }}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6">
        
        {/* Core Monthly Hero: Always displays Monthly Total Spend & How Much Saved This Month */}
        <MonthlySavingsHero
          onOpenAddModal={() => {
            setEditingExpense(null);
            setIsAddModalOpen(true);
          }}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        />

        {/* Dynamic Tab Views */}
        {activeTab === 'daily' && (
          <DailyExpensesView
            onOpenAddModal={() => {
              setEditingExpense(null);
              setIsAddModalOpen(true);
            }}
            onEditExpense={handleEditExpense}
          />
        )}

        {activeTab === 'monthEnd' && (
          <MonthEndAnalysis />
        )}

        {activeTab === 'compare' && (
          <MonthComparisonView />
        )}

      </main>

      {/* Modals */}
      <ExpenseModal
        isOpen={isAddModalOpen}
        onClose={handleCloseExpenseModal}
        editingExpense={editingExpense}
      />

      <BudgetSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <PrintReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* Bottom Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">GharKharch (घर खर्च)</span>
            <span>•</span>
            <span>Middle-Class Family Budget, Spending & Savings Companion</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Private Offline Storage
            </span>
            <span>•</span>
            <span>Safe & Secure Household Finance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}
