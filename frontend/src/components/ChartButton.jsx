import { useState } from 'react';
import { BarChart3, Star, Check, X } from 'lucide-react';
import StockChart from './StockChart';

// Mapeo de nombres
const SYMBOL_MAP = {
  APPLE: 'AAPL',
  MICROSOFT: 'MSFT',
  GOOGLE: 'GOOGL',
  ALPHABET: 'GOOGL',
  AMAZON: 'AMZN',
  META: 'META',
  FACEBOOK: 'META',
  TESLA: 'TSLA',
  NVIDIA: 'NVDA',
  AMD: 'AMD',
  INTEL: 'INTC',
  NETFLIX: 'NFLX',

  JPMORGAN: 'JPM',
  BANKOFAMERICA: 'BAC',
  WELLSFARGO: 'WFC',
  GOLDMANSACHS: 'GS',
  VISA: 'V',
  MASTERCARD: 'MA',

  WALMART: 'WMT',
  TARGET: 'TGT',
  COSTCO: 'COST',
  HOMEDEPOT: 'HD',

  COCACOLA: 'KO',
  PEPSI: 'PEP',
  DISNEY: 'DIS',
  NIKE: 'NKE',
  MCDONALDS: 'MCD',
  STARBUCKS: 'SBUX',
  BOEING: 'BA'
};

function normalizeSymbol(input) {
  const normalized = input.trim().toUpperCase().replace(/\s+/g, '');

  if (SYMBOL_MAP[normalized]) {
    return SYMBOL_MAP[normalized];
  }

  return normalized;
}

export default function ChartButton({ favorites = [], onAddFavorite, onRemoveFavorite }) {
  const [showChart, setShowChart] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [toast, setToast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const normalizedSymbol = normalizeSymbol(inputValue);
      setSymbol(normalizedSymbol);
      setShowChart(true);
      setShowInput(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!symbol) return;

    const isFav = favorites.some((f) => f.symbol === symbol);

    if (isFav) {
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

  const isFavorite = symbol ? favorites.some((f) => f.symbol === symbol) : false;

  return (
    <>
      {!showInput ? (
        <div className="flex gap-2">
          <button
            onClick={() => setShowInput(true)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium flex items-center gap-2"
          >
            <BarChart3 className="w-5 h-5" />
            Ver Gráfico
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Símbolo o nombre (ej: AAPL, Tesla)"
            className="px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-72 text-sm"
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Abrir
          </button>
          <button
            type="button"
            onClick={() => {
              setShowInput(false);
              setInputValue('');
            }}
            className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </form>
      )}

      {showChart && symbol && (
        <StockChart
          symbol={symbol}
          isFavorite={isFavorite}
          favorites={favorites}
          onAddFavorite={onAddFavorite}
          onRemoveFavorite={onRemoveFavorite}
          onClose={() => {
            setShowChart(false);
            setInputValue('');
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-slate-900 dark:bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4 text-green-500" />
          <p className="text-sm font-medium">{toast}</p>
        </div>
      )}
    </>
  );
}
