"use client";

import { useCompletion } from "ai/react"; // imports from Vercel
import ChatHeader from "@/components/chat-header";
import { Companion, Message } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import ChatForm from "@/components/chat-form";
import ChatMessages from "@/components/chat-messages";

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
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>(companion.messages);

  // Use the AI tool to generate a response to the user's message.
  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: `/api/chat/${companion.id}`,
      onFinish(prompt, completion) {
        const systemMessage = {
          role: "system",
          content: completion,
        };

        setMessages((current) => [...current, systemMessage]);
        setInput("");
        router.refresh();
      },
    });

  // onSubmit:
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage = {
      role: "user",
      content: input,
    };
    setMessages((current) => [...current, userMessage]);

    handleSubmit(e);
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader companion={companion} />
      <ChatMessages
        companion={companion}
        messages={messages}
        isLoading={isLoading}
      />
      <ChatForm
        input={input}
        isLoading={isLoading}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ChatClient;

// This is a TypeScript React code snippet that defines a component that uses the useCompletion hook. The useCompletion hook is a custom hook that handles user input and sends it to a chat API endpoint. When the API returns a response, the onFinish callback function is called with the prompt and completion arguments. The completion argument is the response from the API, which is then displayed as a system message in the chat window.

// The onSubmit function is called when the user submits a message. It creates a new message object with the user's input and adds it to the messages state array. It then calls the handleSubmit function, which is provided by the useCompletion hook, to send the user's input to the chat API.
