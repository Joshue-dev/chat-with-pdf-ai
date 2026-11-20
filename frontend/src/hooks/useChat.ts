import { useState, useCallback, useRef, useEffect } from "react";
import { createChatCompletionStream } from "../services/api";

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  mocked?: boolean;
  feedback?: boolean;
}

export interface UseChatOptions {
  fileIds?: string[];
  onError?: (error: Error) => void;
}

export function useChat(options: UseChatOptions = {}) {
  const { fileIds, onError } = options;
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamCleanupRef = useRef<(() => void) | null>(null);
  const nextId = useRef(1);
  const messagesRef = useRef<ConversationMessage[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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
        await createChatCompletionStream(
          {
            messages: [
              ...messagesRef.current.map((m) => ({
                role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant" | "system" | "tool",
                content: m.text,
              })),
              { role: "user" as const, content: trimmed },
            ],
            fileIds,
            stream: true,
          },
          (chunk) => {
            fullResponse += chunk;
            assistantMessage = { ...assistantMessage, text: fullResponse };
            setMessages((current) =>
              current.map((m) => (m.id === assistantId ? assistantMessage : m))
            );
          },
          () => {
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
    [fileIds, onError]
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