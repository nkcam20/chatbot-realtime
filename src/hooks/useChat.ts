import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "";

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  is_online: boolean;
  last_seen: string | null;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface ChatContact extends Profile {
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export function useChat() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const socket = useRef<Socket | null>(null);

  // Initialize Socket
  useEffect(() => {
    if (!user) return;

    socket.current = io(SOCKET_URL);

    socket.current.on("connect", () => {
      console.log("Connected to socket server");
      socket.current?.emit("setup", user.id);
    });

    socket.current.on("message_received", (rawMsg: any) => {
      const newMessage: ChatMessage = {
        id: rawMsg._id,
        sender_id: rawMsg.senderId,
        receiver_id: rawMsg.receiverId,
        content: rawMsg.content,
        is_read: rawMsg.isRead,
        created_at: rawMsg.createdAt,
      };

      if (
        (newMessage.sender_id === user.id && newMessage.receiver_id === activeChat) ||
        (newMessage.sender_id === activeChat && newMessage.receiver_id === user.id)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
      loadContacts();
    });

    socket.current.on("user_online", (userId: string) => {
      setContacts((prev) =>
        prev.map((c) => (c.user_id === userId ? { ...c, is_online: true } : c))
      );
    });

    socket.current.on("user_offline", (userId: string) => {
      setContacts((prev) =>
        prev.map((c) => (c.user_id === userId ? { ...c, is_online: false } : c))
      );
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [user, activeChat]);

  // Load all users as contacts
  const loadContacts = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await api.get("/users");
      const usersData = response.data;

      const contactsWithMeta: ChatContact[] = usersData.map((u: any) => ({
        id: u._id,
        user_id: u._id,
        display_name: u.displayName,
        avatar_url: u.avatarUrl,
        is_online: u.isOnline,
        last_seen: u.lastSeen,
        unreadCount: 0,
      }));

      setContacts(contactsWithMeta);
      setLoading(false);
    } catch (error) {
      console.error("Error loading contacts:", error);
      setLoading(false);
    }
  }, [user]);

  // Load messages for active chat
  const loadMessages = useCallback(async () => {
    if (!user || !activeChat) {
      setMessages([]);
      return;
    }

    try {
      const response = await api.get(`/messages/${activeChat}`);
      const mappedMessages = response.data.map((m: any) => ({
        id: m._id,
        sender_id: m.senderId,
        receiver_id: m.receiverId,
        content: m.content,
        is_read: m.isRead,
        created_at: m.createdAt,
      }));
      setMessages(mappedMessages);

      // Mark as read
      await api.put(`/messages/read/${activeChat}`);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  }, [user, activeChat]);

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!user || !activeChat || !content.trim()) return;
      
      socket.current?.emit("send_message", {
        senderId: user.id,
        receiverId: activeChat,
        content: content.trim(),
      });
    },
    [user, activeChat]
  );

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    contacts,
    messages,
    activeChat,
    setActiveChat,
    sendMessage,
    loading,
  };
}
