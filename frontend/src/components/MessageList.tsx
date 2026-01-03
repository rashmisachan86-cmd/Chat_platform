

export default function MessageList({ messages }: { messages: any[] }) {
  return (
    <div className="space-y-3">
      {messages.map(m => (
        <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
          <div className={`${m.mine ? "bg-primary text-white" : "bg-gray-100 text-gray-800"} px-4 py-2 rounded-2xl max-w-[70%]`}>
            <div>{m.text}</div>
            <div className="text-xs mt-1 text-gray-200">{new Date(m.ts).toLocaleTimeString()}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
