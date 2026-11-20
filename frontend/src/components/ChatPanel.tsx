import { useState, useRef, useEffect } from "react";
import { ChatComposer } from "./ChatComposer";
import { WelcomeMessage, ChatMessage, TypingIndicator } from "./Message";
import { useChat } from "../hooks/useChat";

export function ChatPanel() {
  const { messages, pending, sendMessage } = useChat();
  const [value, setValue] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({
      top: scroller.scrollHeight,
      behavior: hasScrolled.current ? "smooth" : "auto",
    });
    hasScrolled.current = true;
  }, [messages, pending]);

  const handleSend = () => {
    sendMessage(value);
    setValue("");
  };

  return (
    <div className="flex h-full w-full flex-1 flex-col md:w-1/2 md:flex-none overflow-hidden">
      <div
        ref={scrollerRef}
        role="log"
        aria-label="Conversation"
        aria-busy={pending}
        className="min-h-0 flex-1 overscroll-contain px-4 pt-6 pb-4 sm:px-6 md:px-8"
      >
        <div className="flex flex-col gap-6">
          <WelcomeMessage onAsk={sendMessage} />
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {pending ? <TypingIndicator /> : null}
        </div>
      </div>
      <ChatComposer value={value} onChange={setValue} onSend={handleSend} />
    </div>
  );
}
