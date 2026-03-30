import { useState } from "react";
import { Search, Menu, Edit, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ChatContact } from "@/hooks/useChat";
import { useAuth } from "@/contexts/AuthContext";

interface ChatSidebarProps {
  contacts: ChatContact[];
  activeChat: string | null;
  onSelectChat: (userId: string) => void;
}

const ChatSidebar = ({ contacts, activeChat, onSelectChat }: ChatSidebarProps) => {
  const [search, setSearch] = useState("");
  const { signOut, user } = useAuth();

  const filtered = contacts.filter((c) =>
    c.display_name.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (time?: string) => {
    if (!time) return "";
    try {
      return formatDistanceToNow(new Date(time), { addSuffix: false });
    } catch {
      return "";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-[340px] min-w-[280px] flex flex-col bg-sidebar h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button className="p-2 rounded-full hover:bg-sidebar-hover transition-colors">
          <Menu className="w-5 h-5 text-sidebar-foreground" />
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-muted" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-sidebar-search text-sidebar-foreground placeholder:text-sidebar-muted rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        <button
          onClick={signOut}
          className="p-2 rounded-full hover:bg-sidebar-hover transition-colors"
          title="Sign out"
        >
          <LogOut className="w-5 h-5 text-sidebar-muted" />
        </button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto sidebar-scroll">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sidebar-muted text-sm">
            {contacts.length === 0 ? "No users yet. Invite someone to chat!" : "No results found"}
          </div>
        )}
        {filtered.map((contact, i) => (
          <motion.button
            key={contact.user_id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => onSelectChat(contact.user_id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left ${
              activeChat === contact.user_id
                ? "bg-sidebar-active"
                : "hover:bg-sidebar-hover"
            }`}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold ${
                  activeChat === contact.user_id
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-primary/20 text-primary"
                }`}
              >
                {getInitials(contact.display_name)}
              </div>
              {contact.is_online && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-online rounded-full border-2 border-sidebar" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-semibold truncate ${
                    activeChat === contact.user_id
                      ? "text-primary-foreground"
                      : "text-sidebar-foreground"
                  }`}
                >
                  {contact.display_name}
                </span>
                <span
                  className={`text-xs shrink-0 ${
                    activeChat === contact.user_id
                      ? "text-primary-foreground/70"
                      : contact.unreadCount > 0
                      ? "text-primary"
                      : "text-sidebar-muted"
                  }`}
                >
                  {formatTime(contact.lastMessageTime)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span
                  className={`text-xs truncate ${
                    activeChat === contact.user_id
                      ? "text-primary-foreground/70"
                      : "text-sidebar-muted"
                  }`}
                >
                  {contact.lastMessage ?? "No messages yet"}
                </span>
                {contact.unreadCount > 0 && (
                  <span className="ml-2 shrink-0 bg-primary text-primary-foreground text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                    {contact.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* New message FAB */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-5 right-5 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg"
        >
          <Edit className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default ChatSidebar;
