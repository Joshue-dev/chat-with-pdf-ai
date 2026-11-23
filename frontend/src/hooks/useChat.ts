import { useState, useCallback, useRef, useEffect } from "react";
import { uploadDocument } from "../services/api";
import type { SuggestedQuestion } from "../services/api";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export interface UseChatOptions {
  documentId?: string;
  conversationId?: string;
  onConversationIdChange?: (conversationId: string) => void;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  suggestedQuestions: SuggestedQuestion[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  uploadDocument: (file: File) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  clearError: () => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
}
