import { Check, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";

interface MessageData {
  id: string;
  text: string;
  time: string;
  isOutgoing: boolean;
  read: boolean;
}

interface MessageBubbleProps {
  message: MessageData;
  index: number;
}

const MessageBubble = ({ message, index }: MessageBubbleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      className={`flex ${message.isOutgoing ? "justify-end" : "justify-start"} mb-1.5`}
    >
      <div
        className={`max-w-[70%] px-3 py-2 rounded-2xl relative ${
          message.isOutgoing
            ? "bg-bubble-outgoing text-bubble-outgoing-foreground rounded-br-md"
            : "bg-bubble-incoming text-bubble-incoming-foreground rounded-bl-md shadow-sm"
        }`}
      >
        <p className="text-sm leading-relaxed break-words">{message.text}</p>
        <div
          className={`flex items-center justify-end gap-1 mt-0.5 ${
            message.isOutgoing ? "text-primary-foreground/60" : "text-muted-foreground"
          }`}
        >
          <span className="text-[11px]">{message.time}</span>
          {message.isOutgoing && (
            message.read ? (
              <CheckCheck className="w-4 h-4 text-check-read" />
            ) : (
              <Check className="w-4 h-4" />
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
