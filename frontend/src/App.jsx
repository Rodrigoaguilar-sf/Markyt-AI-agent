import { useState, useCallback } from 'react';
import ConversationSidebar from './components/ConversationSidebar';
import ChatWindow from './components/ChatWindow';
import FavoritesPage from './components/FavoritesPage';
import { useConversationHistory } from './hooks/useConversationHistory';
import { useTheme } from './hooks/useTheme';
import { useFavorites } from './hooks/useFavorites';

function App() {
  const {
    conversations,
    currentConversation,
    currentConversationId,
    createNewConversation,
    updateMessages,
    deleteConversation,
    switchConversation
  } = useConversationHistory();

  const { isDark, toggleTheme } = useTheme();

  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const [currentPage, setCurrentPage] = useState('chat');

  const handleNavigate = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleAddFavorite = useCallback(
    (symbol) => {
      return addFavorite(symbol);
    },
    [addFavorite]
  );

  const handleRemoveFavorite = useCallback(
    (symbol) => {
      removeFavorite(symbol);
    },
    [removeFavorite]
  );

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-900">
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={switchConversation}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      {currentPage === 'chat' ? (
        <ChatWindow
          conversation={currentConversation}
          onUpdateMessages={updateMessages}
          favorites={favorites}
          onAddFavorite={handleAddFavorite}
          onRemoveFavorite={handleRemoveFavorite}
        />
      ) : (
        <FavoritesPage
          favorites={favorites}
          onRemoveFavorite={handleRemoveFavorite}
          onAddFavorite={handleAddFavorite}
        />
      )}
    </div>
  );
}

export default App;
