

export default function ConversationList({ conversations, active, onSelect }: { conversations: any[], active?: string, onSelect: (id: string) => void }) {
  return (
    <div>
      <div className="p-4 font-semibold">Chats</div>
      <div>
        {conversations.map(c => (
          <button key={c.id} onClick={() => onSelect(c.id)} className={`w-full text-left px-4 py-3 ${active === c.id ? "bg-gray-100" : ""}`}>
            <div className="font-medium">{c.title}</div>
            <div className="text-xs text-gray-500">{c.lastMessage || 'No messages yet'}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
