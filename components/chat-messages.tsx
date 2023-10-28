"use client";

import { Companion } from "@prisma/client";
import ChatMessage from "./chat-message";
import { ChatMessageProps } from "./chat-message";
import { ElementRef, useEffect, useRef, useState } from "react";

interface ChatMessagesProps {
  messages: ChatMessageProps[];
  isLoading: boolean;
  companion: Companion;
}

const ChatMessages = ({
  messages = [],
  isLoading,
  companion,
}: ChatMessagesProps) => {
  const scrollRef = useRef<ElementRef<'div'>>(null); 

  const [fakeLoading, setFakeLoading] = useState(
    messages.length === 0 ? true : false
  );

  // The ChatMessages component uses the fakeLoading state to simulate a loading state. The component uses the useEffect() hook to set the fakeLoading state to false after 1 second.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFakeLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);


  // Create a smooth scrolling effect when a new message is added to the chat window with a useEffect() hook:
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end", 
      inline: "nearest", 
    });
  } , [messages.length]);



  return (
    <div className="flex-1 overflow-y-auto">
      <ChatMessage
        isLoading={fakeLoading}
        src={companion.src}
        role="system"
        content={`Hello, I am ${companion.name}, ${companion.description}`}
      />
      {messages.map((message, i) => (
        <ChatMessage
          key={i}
          src={message.src}
          role={message.role}
          content={message.content}
        />
      ))}

      {isLoading && ( // The ChatMessages component displays a loading message when the isLoading prop is true.
        <ChatMessage
          role="system"
          src={companion.src}
          isLoading
          content="Thinking..."
        />
      )}
      {/* Helpful for UX: The scrollRef is used to scroll to the bottom of the chat window when a new message is added. */}
      <div ref={scrollRef} /> 
    </div>
  );
};

export default ChatMessages;
