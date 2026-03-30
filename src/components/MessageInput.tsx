import { useState } from "react";
import { Send, Smile, Paperclip, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MessageInputProps {
  onSend: (text: string) => void;
}

const MessageInput = ({ onSend }: MessageInputProps) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-card border-t border-border px-4 py-3">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors shrink-0">
          <Smile className="w-5 h-5" />
        </button>
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors shrink-0">
          <Paperclip className="w-5 h-5" />
        </button>

        <div className="flex-1 bg-secondary rounded-2xl px-4 py-2.5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message"
            rows={1}
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-sm resize-none message-input leading-relaxed max-h-32"
          />
        </div>

        <AnimatePresence mode="wait">
          {text.trim() ? (
            <motion.button
              key="send"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              whileTap={{ scale: 0.85 }}
              onClick={handleSend}
              className="p-2.5 bg-primary text-primary-foreground rounded-full shrink-0"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              key="mic"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="p-2.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <Mic className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MessageInput;
