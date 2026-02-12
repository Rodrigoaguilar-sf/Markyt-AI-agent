import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, Star, Trash2, BarChart2, Plus, X, RefreshCw } from 'lucide-react';
import { getQuote, getChartData } from '../services/api';
import StockChart from './StockChart';

export default function FavoritesPage({ favorites, onRemoveFavorite, onAddFavorite }) {
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [showChart, setShowChart] = useState(null);
  const [newSymbol, setNewSymbol] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);
  const [addError, setAddError] = useState(null);

  const fetchQuote = useCallback(async (symbol) => {
    setLoading((prev) => ({ ...prev, [symbol]: true }));
    setErrors((prev) => ({ ...prev, [symbol]: null }));

    try {
      const data = await getQuote(symbol);
      setQuotes((prev) => ({ ...prev, [symbol]: data }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [symbol]: 'Error al cargar' }));
    } finally {
      setLoading((prev) => ({ ...prev, [symbol]: false }));
    }
  }, []);

  useEffect(() => {
    favorites.forEach((fav) => {
      if (!quotes[fav.symbol]) {
        fetchQuote(fav.symbol);
      }
    });
  }, [favorites, quotes, fetchQuote]);

  useEffect(() => {
    const interval = setInterval(() => {
      favorites.forEach((fav) => fetchQuote(fav.symbol));
    }, 60000);

    return () => clearInterval(interval);
  }, [favorites, fetchQuote]);

  const handleRefresh = (symbol) => {
    fetchQuote(symbol);
  };

  const handleAddSymbol = (e) => {
    e.preventDefault();
    if (newSymbol.trim() && onAddFavorite) {
      const normalized = newSymbol.trim().toUpperCase().replace(/\s+/g, '');
      const result = onAddFavorite(normalized);
      if (result?.success) {
        setNewSymbol('');
        setShowAddInput(false);
        setAddError(null);
      } else {
        setAddError(result?.error || 'Error al agregar');
      }
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  if (favorites.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-slate-800">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-10 h-10 text-yellow-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No tienes favoritos aún</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Agrega acciones desde el chat o buscando arriba para verlas aquí.
          </p>
          <button
            onClick={() => setShowAddInput(true)}
            className="inline-flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Agregar símbolo
          </button>

          {showAddInput && (
            <form onSubmit={handleAddSymbol} className="mt-4 flex gap-2">
              <input
                type="text"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                placeholder="Ej: AAPL"
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Agregar
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-slate-700 p-5 bg-white dark:bg-slate-900">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            Mis Favoritos
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({favorites.length})</span>
          </h2>
          <button
            onClick={() => favorites.forEach((f) => fetchQuote(f.symbol))}
            className="p-2 text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
            title="Actualizar todos"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {favorites.map((fav) => {
            const quote = quotes[fav.symbol];
            const isLoading = loading[fav.symbol];
            const error = errors[fav.symbol];
            const isPositive = quote?.change_percent >= 0;

            return (
              <div
                key={fav.symbol}
                className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 hover:shadow-md dark:hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{fav.symbol}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Agregado {formatDate(fav.addedAt)}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleRefresh(fav.symbol)}
                      className="p-1.5 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 transition-colors"
                      title="Actualizar"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(fav.symbol)}
                      className="p-1.5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {error ? (
                  <div className="text-red-500 text-sm py-4 text-center">{error}</div>
                ) : isLoading ? (
                  <div className="py-4 space-y-2">
                    <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded animate-pulse w-24"></div>
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse w-16"></div>
                  </div>
                ) : quote ? (
                  <div className="mb-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">${quote.current_price}</span>
                      <span
                        className={`flex items-center gap-1 text-sm font-semibold ${
                          isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                        }`}
                      >
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {isPositive ? '+' : ''}
                        {quote.change_percent}%
                      </span>
                    </div>
                    <p
                      className={`text-xs ${
                        isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                      }`}
                    >
                      {isPositive ? '+' : ''}${quote.change?.toFixed(2)} hoy
                    </p>
                  </div>
                ) : null}

                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
                  <button
                    onClick={() => setShowChart(fav.symbol)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
                  >
                    <BarChart2 className="w-4 h-4" />
                    Ver gráfico
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!showAddInput && (
        <button
          onClick={() => setShowAddInput(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors flex items-center justify-center"
          title="Agregar favorito"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {showAddInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Agregar Favorito</h3>
              <button
                onClick={() => setShowAddInput(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSymbol}>
              <input
                type="text"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                placeholder="Ej: AAPL, MSFT, GOOGL"
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 mb-2"
                autoFocus
              />
              {addError && <p className="text-red-500 text-sm mb-4">{addError}</p>}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddInput(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showChart && (
        <StockChart
          symbol={showChart}
          favorites={favorites}
          onAddFavorite={onAddFavorite}
          onRemoveFavorite={onRemoveFavorite}
          onClose={() => setShowChart(null)}
        />
      )}
    </div>
  );
}
