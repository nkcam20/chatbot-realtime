import { useAuth } from "@/contexts/AuthContext";
import ChatSidebar from "@/components/ChatSidebar";
import ChatArea from "@/components/ChatArea";
import { useChat } from "@/hooks/useChat";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { contacts, messages, activeChat, setActiveChat, sendMessage, loading } = useChat();

  if (authLoading || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-chat">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeContact = contacts.find((c) => c.user_id === activeChat) ?? null;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ChatSidebar
        contacts={contacts}
        activeChat={activeChat}
        onSelectChat={setActiveChat}
      />
      <ChatArea
        contact={activeContact}
        messages={messages}
        onSend={sendMessage}
      />
    </div>
  );
};

export default Index;
