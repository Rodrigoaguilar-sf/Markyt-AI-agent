import { useState, useEffect } from 'react';
import { DollarSign, Plus, Trash2, Sun, Moon, X, AlertCircle, MessageSquare, Star } from 'lucide-react';

export default function ConversationSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isDark,
  onToggleTheme,
  currentPage,
  onNavigate
}) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleDelete = (id) => {
    onDeleteConversation(id);
    setDeleteConfirm(null);
    setShowToast(true);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 flex flex-col h-screen shadow-sm">
      <div className="p-5 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-br from-primary-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-primary-500" />
            Markyt
          </h1>
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 transition-colors"
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        <button
          onClick={onNewConversation}
          className="w-full bg-primary-500 text-white py-2.5 px-4 rounded-xl hover:bg-primary-600 active:scale-[0.98] transition-all font-semibold flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Nueva conversación
        </button>
      </div>

      <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-700">
        <nav className="flex gap-1">
          <button
            onClick={() => onNavigate('chat')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 'chat'
                ? 'bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </button>
          <button
            onClick={() => onNavigate('favorites')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 'favorites'
                ? 'bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            <Star className="w-4 h-4" />
            Favoritos
          </button>
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {currentPage === 'chat' && (
          <>
            {conversations.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-8">No hay conversaciones</p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`group flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg cursor-pointer ${
                    conv.id === currentConversationId
                      ? 'bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 font-medium border border-primary-500/20 dark:border-primary-500/30'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => onSelectConversation(conv.id)}
                >
                  <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                    <span className="text-sm truncate">{conv.title}</span>
                    <span
                      className={`text-xs flex-shrink-0 ${
                        conv.id === currentConversationId
                          ? 'text-primary-500/70 dark:text-primary-400/70'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {formatDate(conv.createdAt)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-600 dark:hover:text-red-500" />
                  </button>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">¿Eliminar conversación?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Esta acción no se puede deshacer. Se eliminarán todos los mensajes de esta conversación.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors font-medium"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed top-24 right-6 bg-slate-900 dark:bg-slate-900 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-top duration-300">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <p className="text-sm font-medium">Conversación eliminada</p>
        </div>
      )}

      <div className="px-5 pt-8 pb-7 border-t border-gray-100 dark:border-slate-700 text-xs text-gray-500 dark:text-gray-400">
        <p className="font-medium text-gray-600 dark:text-gray-300">Asesor financiero con IA</p>
        <p className="mt-1">Groq + yfinance</p>
      </div>
    </div>
  );
}
