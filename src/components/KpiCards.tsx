import type { MonthlySummary } from '../lib/types';

interface Props {
  summary: MonthlySummary;
}

export default function KpiCards({ summary }: Props) {
  const cards = [
    {
      label: 'Total Ingresos',
      value: summary.totalIncome,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
    {
      label: 'Total Gastos',
      value: summary.totalExpenses,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
    {
      label: 'Balance',
      value: summary.balance,
      color: summary.balance >= 0 ? 'text-green-600' : 'text-red-600',
      bg: summary.balance >= 0 ? 'bg-green-50' : 'bg-red-50',
      border: summary.balance >= 0 ? 'border-green-200' : 'border-red-200',
    },
  ];

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-xl border ${card.border} ${card.bg} p-4`}>
          <p className="text-sm text-gray-600 mb-1">{card.label}</p>
          <p className={`text-2xl font-bold ${card.color}`}>{formatCurrency(card.value)}</p>
        </div>
      ))}
    </div>
  );
}
