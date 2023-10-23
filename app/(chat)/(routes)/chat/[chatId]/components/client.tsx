"use client";
import ChatHeader from "@/components/chat-header";
import { Companion, Message } from "@prisma/client";

// The ChatClient component receives the companion as a prop. The companion object contains the messages field, which is an array of Message objects. The _count field contains the number of messages in the array.
interface ChatClientProps {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}

const ChatClient = ({ companion }: ChatClientProps) => {
  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader companion={companion} />
      <h1>Chat client messages goes here</h1>
    </div>
  );
};

export default ChatClient;
