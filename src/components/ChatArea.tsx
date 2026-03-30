import { useRef, useEffect } from "react";
import { Phone, Video, MoreVertical, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { ChatContact, ChatMessage } from "@/hooks/useChat";
import { useAuth } from "@/contexts/AuthContext";

interface ChatAreaProps {
  contact: ChatContact | null;
  messages: ChatMessage[];
  onSend: (text: string) => void;
}

const ChatArea = ({ contact, messages, onSend }: ChatAreaProps) => {
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-chat">
        <div className="text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Select a chat</h2>
          <p className="text-sm text-muted-foreground">Choose a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  const lastSeenText = contact.is_online
    ? "online"
    : contact.last_seen
    ? `last seen ${formatDistanceToNow(new Date(contact.last_seen), { addSuffix: true })}`
    : "last seen recently";

  return (
    <div className="flex-1 flex flex-col bg-chat min-w-0">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-2.5 flex items-center gap-3 shrink-0">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
            {getInitials(contact.display_name)}
          </div>
          {contact.is_online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-online rounded-full border-2 border-card" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">{contact.display_name}</h3>
          <p className="text-xs text-muted-foreground">
            {contact.is_online ? (
              <span className="text-online">online</span>
            ) : (
              lastSeenText
            )}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <Phone className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <Video className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll px-4 py-4">
        <div className="max-w-3xl mx-auto space-y-0.5">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-12">
              No messages yet. Say hello! 👋
            </div>
          )}
          {messages.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              message={{
                id: msg.id,
                text: msg.content,
                time: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                isOutgoing: msg.sender_id === user?.id,
                read: msg.is_read,
              }}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Input */}
      <MessageInput onSend={onSend} />
    </div>
  );
};

export default ChatArea;
