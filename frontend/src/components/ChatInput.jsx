import { useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ChatInput({ onSendMessage, disabled }) {
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      const message = input.trim();
      const success = await onSendMessage(message);
      if (success) {
        setInput('');
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-100 dark:border-slate-700 p-5 bg-white dark:bg-slate-900"
    >
      <div className="max-w-3xl mx-auto relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-blue-400 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity"></div>
        <div className="relative flex gap-3 items-center bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-2 pl-4 rounded-2xl shadow-xl">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pregunta sobre acciones, análisis, inversiones..."
            disabled={disabled}
            className="flex-1 resize-none bg-transparent border-none text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 p-2 focus:outline-none disabled:bg-transparent disabled:cursor-not-allowed transition-all max-h-32"
            rows="1"
          />
          <button
            type="submit"
            disabled={disabled || !input.trim()}
            className="w-10 h-10 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed active:scale-95 transition-all flex items-center justify-center shadow-md flex-shrink-0"
          >
            <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </form>
  );
}
