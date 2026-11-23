import { useState, useCallback, useRef, useEffect } from "react";
import { sendChatMessageStream } from "../services/api";

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  mocked?: boolean;
  feedback?: boolean;
}

export interface UseChatOptions {
  documentId?: string;
  conversationId?: string;
  onError?: (error: Error) => void;
  onConversationId?: (conversationId: string) => void;
}

export function useChat(options: UseChatOptions = {}) {
  const { documentId, conversationId, onError, onConversationId } = options;
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamCleanupRef = useRef<(() => void) | null>(null);
  const nextId = useRef(1);
  const messagesRef = useRef<ConversationMessage[]>([]);
  const currentConversationIdRef = useRef<string | undefined>(conversationId);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    currentConversationIdRef.current = conversationId;
  }, [conversationId]);

  const resetChat = useCallback(() => {
    if (streamCleanupRef.current) {
      streamCleanupRef.current();
      streamCleanupRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setMessages([]);
    setSuggestedQuestions([]);
    nextId.current = 1;
    setPending(false);
  }, []);

  const setSuggestedQuestionsFromBackend = useCallback((questions: string[]) => {
    setSuggestedQuestions(questions);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      if (!documentId) {
        onError?.(new Error("No document ID available"));
        return;
      }

      const convId = currentConversationIdRef.current;
      if (!convId) {
        onError?.(new Error("No conversation ID available"));
        return;
      }

      // Cancel any ongoing stream
      if (streamCleanupRef.current) {
        streamCleanupRef.current();
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const userMessage: ConversationMessage = {
        id: `user-${nextId.current++}`,
        role: "user",
        text: trimmed,
      };

      setMessages((current) => [...current, userMessage]);
      setPending(true);

      // Add placeholder assistant message that will be updated via streaming
      const assistantId = `assistant-${nextId.current++}`;
      let assistantMessage: ConversationMessage = {
        id: assistantId,
        role: "assistant",
        text: "",
      };

      setMessages((current) => [...current, assistantMessage]);

      abortControllerRef.current = new AbortController();

      let fullResponse = "";

      try {
        await sendChatMessageStream(
          documentId,
          convId,
          trimmed,
          (chunk) => {
            fullResponse += chunk;
            assistantMessage = { ...assistantMessage, text: fullResponse };
            setMessages((current) =>
              current.map((m) => (m.id === assistantId ? assistantMessage : m))
            );
          },
          (returnedConversationId) => {
            if (returnedConversationId && onConversationId) {
              onConversationId(returnedConversationId);
            }
            setPending(false);
            streamCleanupRef.current = null;
            abortControllerRef.current = null;
          },
          (error) => {
            const errorMessage: ConversationMessage = {
              id: assistantId,
              role: "assistant",
              text: `Error: ${error.message}`,
            };
            setMessages((current) =>
              current.map((m) => (m.id === assistantId ? errorMessage : m))
            );
            setPending(false);
            streamCleanupRef.current = null;
            abortControllerRef.current = null;
            onError?.(error);
          }
        );
      } catch (error) {
        const errorMessage: ConversationMessage = {
          id: assistantId,
          role: "assistant",
          text: `Error: ${(error as Error).message}`,
        };
        setMessages((current) =>
          current.map((m) => (m.id === assistantId ? errorMessage : m))
        );
        setPending(false);
        onError?.(error as Error);
      }
    },
    [documentId, onError, onConversationId]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamCleanupRef.current) {
        streamCleanupRef.current();
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    messages,
    pending,
    suggestedQuestions,
    sendMessage,
    resetChat,
    setSuggestedQuestions: setSuggestedQuestionsFromBackend,
  };
}