"use client";

import { useTheme } from "next-themes";
import { useToast } from "./ui/use-toast";
import { cn } from "@/lib/utils";
import BotAvatar from "./bot-avatar";
import { BeatLoader } from "react-spinners";
import UserAvatar from "./user-avatar";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";

// export the interface for the ChatMessage component
export interface ChatMessageProps {
  role: "system" | "user"; // the role of the message
  content?: string; // the content of the message
  isLoading?: boolean;
  src?: string;
}


const ChatMessage = ({ role, content, isLoading, src }: ChatMessageProps) => {
  const { toast } = useToast();
  const { theme } = useTheme();

  // The onCopy() method is called when the user clicks the copy button. The method copies the message content to the clipboard and displays a toast notification.
  const onCopy = () => {
    // copy the message content to the clipboard
    if (!content) return;
    navigator.clipboard.writeText(content); // write the message to the clipboard
    toast({
      description: "Copied to clipboard.",
    });
  };

  return (
    <div
      className={cn(
        "group flex items-start gap-x-3 py-4 w-full",
        role === "user" && "justify-end"
      )}
    >
      {role !== "user" && src && <BotAvatar src={src} />}
      <div className="rounded-md px-4 py-2 max-w-sm text-sm bg-primary/10">
        {isLoading ? (
          <BeatLoader 
            size={5}
            color={theme === "light" ? "black" : "white"} />
        ) : (
          content
        )}
      </div>
      
      {role === "user" && <UserAvatar /> } 
      {role !== "user" && !isLoading && (
        <Button 
          className="opacity-0 group-hover:opacity-100 transition"
          onClick={onCopy}
          size='icon'
          variant='ghost'
        >
          <Copy className="w-4 h-4" />
        </Button>
      ) }
    </div>
  );
};

export default ChatMessage;
