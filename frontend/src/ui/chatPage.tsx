import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { ChatComposer } from "../components/ChatComposer";
import {
  ChatMessage,
  TypingIndicator,
  WelcomeMessage,
  type ConversationMessage,
} from "../components/Message";

const initialMessages: ConversationMessage[] = [
  {
    id: "user-timeframe",
    role: "user",
    text: "What is the estimated timeframe for the entire project from start to finish?",
  },
  {
    id: "assistant-timeframe",
    role: "assistant",
    text: "The estimated timeframe for the entire project from start to finish is 3 to 6 weeks. This includes the phases of Discovery and Research (3-7 days), UI/UX Design (1-2 weeks), and Development (1-3 weeks).",
    citation: "4",
  },
];

function simulatedAnswer(question: string) {
  const normalized = question.toLowerCase();
  if (normalized.includes("timeframe") || normalized.includes("start to finish")) {
    return "The estimated timeframe for the entire project from start to finish is 3 to 6 weeks. This includes the phases of Discovery and Research (3-7 days), UI/UX Design (1-2 weeks), and Development (1-3 weeks).";
  }
  if (normalized.includes("approach to developing")) {
    return "In this sample proposal, Stephen Jude starts with discovery, then shapes a user-centric product narrative before designing and building the interface. This placeholder only illustrates that flow.";
  }
  if (normalized.includes("product design strategy") || normalized.includes("key components")) {
    return "The sample proposal organizes the GOAT Token work into discovery and research, UI/UX design, and development, aimed at a landing page that matches the brand.";
  }
  if (normalized.includes("accessibility") || normalized.includes("responsiveness")) {
    return "The sample proposal plans the landing page so it stays readable and usable across devices, with responsive layouts and accessible interface patterns.";
  }
  return `Nothing was sent to an AI service. This placeholder only echoes what you wrote: “${question.trim()}”.`;
}

export const ChatPage = () => {
  const [messages, setMessages] = useState<ConversationMessage[]>(initialMessages);
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);
  const replyTimer = useRef<number | null>(null);
  const nextId = useRef(1);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({
      top: scroller.scrollHeight,
      behavior: hasScrolled.current ? "smooth" : "auto",
    });
    hasScrolled.current = true;
  }, [messages, pending]);

  useEffect(() => {
    return () => {
      if (replyTimer.current !== null) window.clearTimeout(replyTimer.current);
    };
  }, []);

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMessage: ConversationMessage = {
      id: `user-${nextId.current++}`,
      role: "user",
      text: trimmed,
    };
    setMessages((current) => [...current, userMessage]);
    setPending(true);
    if (replyTimer.current !== null) window.clearTimeout(replyTimer.current);
    const answer = simulatedAnswer(trimmed);
    replyTimer.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${nextId.current++}`,
          role: "assistant",
          text: answer,
          mocked: true,
          feedback: true,
        },
      ]);
      setPending(false);
      replyTimer.current = null;
    }, 900);
  }

  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#fcfcfe] md:flex-row">
      <div className="flex min-h-0 w-full flex-1 flex-col md:w-1/2 md:flex-none">
        <h2 className="sr-only">Document conversation</h2>
        <div
          ref={scrollerRef}
          role="log"
          aria-label="Conversation"
          aria-busy={pending}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-6 pb-4 sm:px-6 md:px-8"
        >
          <div className="flex flex-col gap-8">
            <WelcomeMessage onAsk={sendMessage} />
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {pending ? <TypingIndicator /> : null}
          </div>
        </div>
        <ChatComposer
          value={value}
          onChange={setValue}
          onSend={() => {
            sendMessage(value);
            setValue("");
          }}
        />
      </div>
      <DocumentPanel />
    </section>
  );
};

const DocumentPanel = () => {
  const [page, setPage] = useState(1);
  return (
    <section className="flex h-40 w-full shrink-0 flex-col overflow-hidden border-t border-gray-300 bg-white md:h-full md:w-1/2 md:flex-none md:border-t-0 md:border-l">
      <div className="pdf-toolbar flex shrink-0 items-center gap-2 overflow-x-auto px-3 py-2">
        <button className="active-tool" aria-label="Select text">
          <Icon icon="mdi:mouse-pointer" />
        </button>
        <button aria-label="Document view">
          <Icon icon="mdi:file-text" />
        </button>
        <button aria-label="Zoom in">
          <Icon icon="mdi:zoom-in" />
        </button>
        <button aria-label="Zoom out">
          <Icon icon="mdi:zoom-out" />
        </button>
        <div className="page-control flex items-center gap-1">
          <span>Page</span>
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            aria-label="Previous page"
          >
            <Icon icon="mdi:chevron-left" />
          </button>
          <b>{page}</b>
          <span>of 100</span>
          <button
            onClick={() => setPage(Math.min(100, page + 1))}
            aria-label="Next page"
          >
            <Icon icon="mdi:chevron-right" />
          </button>
        </div>
      </div>
      <div className="pdf-stage min-h-0 flex-1 overflow-auto">
        <div className="vertical-label">
          arXiv:2311.17835v1 [cs.LG] 29 Nov 2023
        </div>
      </div>
    </section>
  );
};
