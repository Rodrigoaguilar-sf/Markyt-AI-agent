import { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import ChartButton from './ChartButton';
import { sendMessage } from '../services/api';

export default function ChatWindow({ conversation, onUpdateMessages, favorites, onAddFavorite, onRemoveFavorite }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const prevConversationId = useRef(null);

  const scrollToBottom = (instant = false) => {
    messagesEndRef.current?.scrollIntoView({ behavior: instant ? 'instant' : 'smooth' });
  };

  useEffect(() => {
    // Reset error and loading state when conversation changes
    const conversationChanged = prevConversationId.current !== conversation?.id;
    if (conversationChanged) {
      setError(null);
      setIsLoading(false);
      prevConversationId.current = conversation?.id;
      // Instant scroll when switching conversations
      scrollToBottom(true);
    } else {
      // Smooth scroll when messages are added
      scrollToBottom(false);
    }
  }, [conversation?.messages, conversation?.id]);

  const handleSendMessage = async (content) => {
    if (!conversation) return false;

    setError(null);
    setIsLoading(true);

    // Agregar mensaje del usuario
    const userMessage = { role: 'user', content };
    const updatedMessages = [...conversation.messages, userMessage];
    onUpdateMessages(updatedMessages);

    try {
      // Llamar a la API
      const response = await sendMessage(content, conversation.messages);

      // Agregar respuesta del asistente
      const assistantMessage = {
        role: 'assistant',
        content: response.response
      };

      onUpdateMessages([...updatedMessages, assistantMessage]);
      return true;
    } catch (err) {
      setError('No pudimos procesar tu consulta. Por favor, intenta de nuevo.');
      console.error(err);

      // Remover el mensaje del usuario si hubo error
      onUpdateMessages(conversation.messages);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-slate-800">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Selecciona o crea una conversación</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-slate-700 p-5 bg-white dark:bg-slate-900 shadow-sm flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{conversation.title}</h2>
        <ChartButton favorites={favorites} onAddFavorite={onAddFavorite} onRemoveFavorite={onRemoveFavorite} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-slate-800">
        {conversation.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-left max-w-md">
              <div className="flex items-center justify-start gap-4 mb-4">
                <Sparkles className="w-10 h-10 text-primary-500" />
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">¡Hola! Soy tu asesor financiero</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                Puedo ayudarte a analizar acciones, comparar inversiones y darte recomendaciones personalizadas.
              </p>
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 rounded-r-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ <strong>Importante:</strong> Esta información es solo con fines educativos. Siempre consulta con un
                  asesor financiero profesional y verifica las fuentes antes de tomar decisiones de inversión.
                </p>
              </div>
              <div className="text-left bg-white dark:bg-slate-900 rounded-xl p-5 text-sm border border-gray-200 dark:border-slate-700 shadow-sm">
                <p className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Preguntas de ejemplo:</p>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• "¿Cuál es el precio de AAPL?"</li>
                  <li>• "Analiza GOOGL, MSFT y TSLA"</li>
                  <li>• "¿En qué debería invertir $1000?"</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <>
            {conversation.messages.map((msg, idx) => (
              <MessageBubble key={idx} message={msg} isUser={msg.role === 'user'} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl px-5 py-3.5 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce" />
                    <div className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm shadow-sm">
          {error}
        </div>
      )}

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
