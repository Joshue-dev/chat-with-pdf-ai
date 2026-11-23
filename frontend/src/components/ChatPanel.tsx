import { useState, useRef, useEffect } from "react";
import { ChatComposer } from "./ChatComposer";
import {
  DocumentWelcomeMessage,
  ChatMessage,
  TypingIndicator,
  type ConversationMessage,
} from "./Message";
import { useChat } from "../hooks/useChat";
interface ChatPanelProps {
  documentId?: string;
  conversationId?: string;
  onConversationIdChange?: (conversationId: string) => void;
  suggestedQuestions: { id: number; question: string }[];
}

export function ChatPanel({
  documentId,
  conversationId,
  onConversationIdChange,
  suggestedQuestions,
}: ChatPanelProps) {
  // const { messages, isLoading, sendMessage } = useChat({
  //   documentId,
  //   conversationId,
  //   onConversationId: onConversationIdChange,
  // });
  const [value, setValue] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);

  // useEffect(() => {
  //   const scroller = scrollerRef.current;
  //   if (!scroller) return;
  //   scroller.scrollTo({
  //     top: scroller.scrollHeight,
  //     behavior: hasScrolled.current ? "smooth" : "auto",
  //   });
  //   hasScrolled.current = true;
  // }, [messages, isLoading]);

  const handleSend = () => {
    // sendMessage(value);
    setValue("");
  };


  return (
    <div className="flex h-full w-full flex-1 flex-col md:w-1/2 md:flex-none overflow-hidden">
      <div
        ref={scrollerRef}
        role="log"
        aria-label="Conversation"
        // aria-busy={isLoading}
        className="min-h-0 flex-1 overscroll-contain px-4 pt-6 pb-4 sm:px-6 md:px-8"
      >
        <div className="flex flex-col gap-6">
          <DocumentWelcomeMessage
            suggestedQuestions={suggestedQuestions}
            onSetInput={setValue}
          />
          {/* {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading ? <TypingIndicator /> : null} */}
        </div>
      </div>
      {/* <ChatComposer
        value={value}
        onChange={setValue}
        onSend={handleSend}
        disabled={isLoading}
      /> */}
    </div>
  );
}
