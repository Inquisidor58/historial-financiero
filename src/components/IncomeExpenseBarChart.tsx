import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Transaction } from '../lib/types';
import { useMemo } from 'react';

interface Props {
  transactions: Transaction[];
}

export default function IncomeExpenseBarChart({ transactions }: Props) {
  const data = useMemo(() => {
    const grouped: Record<string, { income: number; expense: number }> = {};

    transactions.forEach((t) => {
      const day = new Date(t.date).getDate().toString();
      if (!grouped[day]) grouped[day] = { income: 0, expense: 0 };
      if (t.type === 'income') grouped[day].income += Number(t.amount);
      else grouped[day].expense += Number(t.amount);
    });

    return Object.entries(grouped)
      .map(([day, vals]) => ({ day: `Día ${day}`, ...vals }))
      .sort((a, b) => parseInt(a.day) - parseInt(b.day));
  }, [transactions]);

  if (data.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Ingresos vs Gastos por Día</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#16a34a" name="Ingresos" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" fill="#dc2626" name="Gastos" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
