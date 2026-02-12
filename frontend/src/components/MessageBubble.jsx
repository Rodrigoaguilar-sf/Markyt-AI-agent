export default function MessageBubble({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm ${
          isUser
            ? 'bg-primary-500 text-white'
            : 'bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-700'
        }`}
      >
        <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
}
