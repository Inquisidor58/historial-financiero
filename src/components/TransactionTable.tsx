import type { Transaction } from '../lib/types';

interface Props {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: number) => void;
  categoryFilter: string;
  onCategoryFilterChange: (cat: string) => void;
  categories: { name: string; type: string }[];
}

export default function TransactionTable({
  transactions,
  onEdit,
  onDelete,
  categoryFilter,
  onCategoryFilterChange,
  categories,
}: Props) {
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

  const uniqueCategories = [...new Set(transactions.map((t) => t.category))];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <label className="text-sm font-medium text-gray-700">Filtrar por categoría:</label>
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="all">Todas</option>
          {categories.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-3 font-semibold">Fecha</th>
              <th className="px-4 py-3 font-semibold">Categoría</th>
              <th className="px-4 py-3 font-semibold hidden sm:table-cell">Descripción</th>
              <th className="px-4 py-3 font-semibold text-right">Ingreso</th>
              <th className="px-4 py-3 font-semibold text-right">Gasto</th>
              <th className="px-4 py-3 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No hay transacciones en este mes
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(t.date).toLocaleDateString('es-CO')}
                  </td>
                  <td className="px-4 py-3">{t.category}</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-600 max-w-[200px] truncate">
                    {t.description || '—'}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${t.type === 'income' ? 'text-green-600' : ''}`}>
                    {t.type === 'income' ? formatCurrency(t.amount) : '—'}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${t.type === 'expense' ? 'text-red-600' : ''}`}>
                    {t.type === 'expense' ? formatCurrency(t.amount) : '—'}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => onEdit(t)}
                      className="text-blue-600 hover:text-blue-800 mr-2 transition-colors"
                      title="Editar"
                    >
                      <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(t.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Eliminar"
                    >
                      <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
