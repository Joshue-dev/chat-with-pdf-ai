import { useState, useCallback, useRef } from "react";
import type { ConversationMessage } from "../components/Message";

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

function simulatedAnswer(question: string): string {
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
  return `Nothing was sent to an AI service. This placeholder only echoes what you wrote: "${question.trim()}".`;
}

export function useChat() {
  const [messages, setMessages] = useState<ConversationMessage[]>(initialMessages);
  const [pending, setPending] = useState(false);
  const replyTimer = useRef<number | null>(null);
  const nextId = useRef(1);

  const sendMessage = useCallback((text: string) => {
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
  }, []);

  const resetChat = useCallback(() => {
    setMessages(initialMessages);
    nextId.current = 1;
    if (replyTimer.current !== null) {
      window.clearTimeout(replyTimer.current);
      replyTimer.current = null;
    }
    setPending(false);
  }, []);

  return { messages, pending, sendMessage, resetChat };
}