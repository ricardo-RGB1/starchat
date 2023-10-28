const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full justify-center">
        {children}
    </div>
    )
};

export default ChatLayout;