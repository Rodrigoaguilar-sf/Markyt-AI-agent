import { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Star, X, Check } from 'lucide-react';
import { getChartData } from '../services/api';

export default function StockChart({ symbol, onClose, favorites = [], onAddFavorite, onRemoveFavorite }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('3mo');
  const [toast, setToast] = useState(null);

  const isFavorite = useMemo(() => {
    return favorites.some((f) => f.symbol === symbol);
  }, [favorites, symbol]);

  const loadChart = async (selectedPeriod) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getChartData(symbol, selectedPeriod);
      setChartData(data);
    } catch (err) {
      setError('Error al cargar datos del gráfico');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChart(period);
  }, []);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    loadChart(newPeriod);
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      onRemoveFavorite?.(symbol);
      setToast('Eliminado de favoritos');
    } else {
      const result = onAddFavorite?.(symbol);
      if (result?.success) {
        setToast('Agregado a favoritos');
      } else {
        setToast(result?.error || 'Error al agregar');
      }
    }
  };

  const periods = [
    { value: '1mo', label: '1M' },
    { value: '3mo', label: '3M' },
    { value: '6mo', label: '6M' },
    { value: '1y', label: '1A' },
    { value: '5y', label: '5A' }
  ];

  const isPositive = chartData?.change_percent >= 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{symbol}</h2>
              {chartData && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">${chartData.current_price}</span>
                  <span
                    className={`flex items-center gap-1 text-base font-semibold ${
                      isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                    }`}
                  >
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {isPositive ? '+' : ''}
                    {chartData.change_percent}%
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(onAddFavorite || onRemoveFavorite) && (
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500'
                    : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
                title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl font-bold w-8 h-8 flex items-center justify-center flex-shrink-0"
            >
              ×
            </button>
          </div>
        </div>


        <div className="px-4 pt-3 pb-2 flex gap-2 flex-shrink-0">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => handlePeriodChange(p.value)}
              className={`px-3 py-1.5 rounded-lg font-medium text-sm ${
                period === p.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {loading && (
            <div className="h-64 flex items-center justify-center">
              <div className="text-gray-500 dark:text-gray-400">Cargando datos...</div>
            </div>
          )}

          {error && (
            <div className="h-64 flex items-center justify-center">
              <div className="text-red-600 dark:text-red-500">{error}</div>
            </div>
          )}

          {chartData && !loading && (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData.data}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(15, 23, 42)',
                    border: '1px solid rgb(51, 65, 85)',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                  itemStyle={{ color: 'rgb(226, 232, 240)' }}
                  labelStyle={{ color: 'rgb(226, 232, 240)' }}
                  formatter={(value) => [`$${value}`, 'Precio']}
                  labelFormatter={(label) => `Fecha: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? '#10b981' : '#ef4444'}
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {chartData && chartData.data && chartData.data.length > 0 && (
          <div className="px-4 pb-4 flex-shrink-0">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Volumen Promedio</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {(
                    chartData.data.reduce((sum, d) => sum + (d.volume || 0), 0) /
                    chartData.data.length /
                    1000000
                  ).toFixed(2)}
                  M
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Máximo</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  ${Math.max(...chartData.data.map((d) => d.high || d.price || 0)).toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Mínimo</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  ${Math.min(...chartData.data.map((d) => d.low || d.price || 0)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-slate-900 dark:bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4 text-green-500" />
          <p className="text-sm font-medium">{toast}</p>
        </div>
      )}
    </div>
  );
}
