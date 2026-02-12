import { useState, useEffect } from 'react';

const STORAGE_KEY = 'markyt_conversations';

export function useConversationHistory() {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConversations(parsed);

        if (parsed.length > 0) {
          setCurrentConversationId(parsed[0].id);
        }
      } else {
        const newConv = {
          id: Date.now().toString(),
          title: 'Nueva',
          messages: [],
          createdAt: new Date().toISOString()
        };
        setConversations([newConv]);
        setCurrentConversationId(newConv.id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      const newConv = {
        id: Date.now().toString(),
        title: 'Nueva',
        messages: [],
        createdAt: new Date().toISOString()
      };
      setConversations([newConv]);
      setCurrentConversationId(newConv.id);
    }
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

  const createNewConversation = () => {
    const newConv = {
      id: Date.now().toString(),
      title: 'Nueva',
      messages: [],
      createdAt: new Date().toISOString()
    };

    setConversations((prev) => [newConv, ...prev]);
    setCurrentConversationId(newConv.id);

    return newConv.id;
  };

  const getCurrentConversation = () => {
    return conversations.find((c) => c.id === currentConversationId);
  };

  const addMessage = (message) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === currentConversationId) {
          const updatedMessages = [...conv.messages, message];

          // Actualizar título si es el primer mensaje del usuario
          let newTitle = conv.title;
          if (updatedMessages.length === 1 && message.role === 'user') {
            newTitle = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
          }

          return {
            ...conv,
            messages: updatedMessages,
            title: newTitle,
            updatedAt: new Date().toISOString()
          };
        }
        return conv;
      })
    );
  };

  const updateMessages = (messages) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === currentConversationId) {
          let newTitle = conv.title;
          if (messages.length > 0 && (conv.title === 'Nueva' || conv.title === 'Nueva conversación')) {
            const firstUserMsg = messages.find((m) => m.role === 'user');
            if (firstUserMsg) {
              newTitle = firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? '...' : '');
            }
          }

          return {
            ...conv,
            messages,
            title: newTitle,
            updatedAt: new Date().toISOString()
          };
        }
        return conv;
      })
    );
  };

  const deleteConversation = (id) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);

      if (id === currentConversationId) {
        if (filtered.length > 0) {
          setCurrentConversationId(filtered[0].id);
        } else {
          createNewConversation();
        }
      }

      return filtered;
    });
  };

  const switchConversation = (id) => {
    setCurrentConversationId(id);
  };

  const clearAllHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConversations([]);
    createNewConversation();
  };

  return {
    conversations,
    currentConversation: getCurrentConversation(),
    currentConversationId,
    createNewConversation,
    addMessage,
    updateMessages,
    deleteConversation,
    switchConversation,
    clearAllHistory
  };
}
