import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import MonthSelector from '../components/MonthSelector';
import KpiCards from '../components/KpiCards';
import TransactionTable from '../components/TransactionTable';
import TransactionModal from '../components/TransactionModal';
import IncomeExpenseBarChart from '../components/IncomeExpenseBarChart';
import ExpensePieChart from '../components/ExpensePieChart';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import type { Transaction, TransactionFormData } from '../lib/types';

export default function Dashboard() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const {
    transactions,
    categories,
    loading,
    summary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions(year, month, categoryFilter);

  const handleSave = async (data: TransactionFormData): Promise<boolean> => {
    const payload = { ...data, amount: Number(data.amount) };
    if (editingTransaction) {
      return updateTransaction(editingTransaction.id, payload);
    }
    return addTransaction(payload);
  };

  const handleEdit = (t: Transaction) => {
    setEditingTransaction(t);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Eliminar esta transacción?')) {
      await deleteTransaction(id);
    }
  };

  const openNewModal = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const hasTransactions = transactions.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <MonthSelector year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />
        <button
          onClick={openNewModal}
          className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Transacción
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <KpiCards summary={summary} />

          {hasTransactions ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <IncomeExpenseBarChart transactions={transactions} />
              <ExpensePieChart transactions={transactions} />
            </div>
          ) : (
            <EmptyState />
          )}

          <TransactionTable
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            categories={categories}
          />
        </>
      )}

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTransaction(null); }}
        onSave={handleSave}
        transaction={editingTransaction}
        categories={categories}
      />
    </div>
  );
}
