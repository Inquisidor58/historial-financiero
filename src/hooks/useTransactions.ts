import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Transaction, TransactionFormData, Category, MonthlySummary } from '../lib/types';
import toast from 'react-hot-toast';

export function useTransactions(year: number, month: number, categoryFilter?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('transactions')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (categoryFilter && categoryFilter !== 'all') {
      query = query.eq('category', categoryFilter);
    }

    const { data, error } = await query;

    if (error) {
      toast.error('Error al cargar transacciones');
    } else {
      setTransactions(data ?? []);
    }
    setLoading(false);
  }, [year, month, categoryFilter, startDate, endDate]);

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase.from('categories').select('*').order('id');
    if (data) setCategories(data);
  }, []);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [fetchTransactions, fetchCategories]);

  const summary: MonthlySummary = transactions.reduce(
    (acc, t) => {
      const amount = Number(t.amount);
      if (t.type === 'income') acc.totalIncome += amount;
      else acc.totalExpenses += amount;
      acc.balance = acc.totalIncome - acc.totalExpenses;
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0, balance: 0 },
  );

  const addTransaction = async (data: TransactionFormData) => {
    if (!user) {
      toast.error('Debes iniciar sesión');
      return false;
    }
    const { error } = await supabase.from('transactions').insert([{ ...data, user_id: user.id }]);
    if (error) {
      toast.error('Error al crear transacción');
      return false;
    }
    toast.success('Transacción creada');
    fetchTransactions();
    return true;
  };

  const updateTransaction = async (id: number, data: TransactionFormData) => {
    const { error } = await supabase.from('transactions').update(data).eq('id', id);
    if (error) {
      toast.error('Error al actualizar transacción');
      return false;
    }
    toast.success('Transacción actualizada');
    fetchTransactions();
    return true;
  };

  const deleteTransaction = async (id: number) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
      toast.error('Error al eliminar transacción');
      return false;
    }
    toast.success('Transacción eliminada');
    fetchTransactions();
    return true;
  };

  return {
    transactions,
    categories,
    loading,
    summary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refresh: fetchTransactions,
  };
}
