const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export interface UploadResponse {
  documentId: string;
  conversationId: string;
  suggestedQuestions: SuggestedQuestion[];
}

export interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
}

export interface SuggestedQuestion {
  id: string;
  question: string;
}

export interface DocumentUploadResult {
  documentId: string;
  conversationId: string;
  suggestedQuestions: SuggestedQuestion[];
}

export interface ChatResponse {
  content: string;
  conversationId: string;
  messageId: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ErrorResponse = await response.json().catch(() => ({
      code: "UNKNOWN_ERROR",
      message: response.statusText,
      statusCode: response.status,
    }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

export async function uploadDocument(file: File): Promise<DocumentUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("action", "upload");

  const response = await fetch(`${API_BASE}/document-chat`, {
    method: "POST",
    body: formData,
  });

  return handleResponse<DocumentUploadResult>(response);
}

export async function sendChatMessage(
  documentId: string,
  conversationId: string,
  message: string
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE}/document-chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "chat",
      documentId,
      conversationId,
      message,
      stream: false,
    }),
  });

  return handleResponse<ChatResponse>(response);
}

export async function sendChatMessageStream(
  documentId: string,
  conversationId: string,
  message: string,
  onChunk: (chunk: string) => void,
  onComplete: (conversationId: string) => void,
  onError: (error: Error) => void
): Promise<void> {
  const response = await fetch(`${API_BASE}/document-chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "chat",
      documentId,
      conversationId,
      message,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json().catch(() => ({
      code: "UNKNOWN_ERROR",
      message: response.statusText,
      statusCode: response.status,
    }));
    onError(new Error(error.message || `HTTP ${response.status}`));
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    onError(new Error("No response body"));
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              onChunk(parsed.content);
            }
            if (parsed.done) {
              onComplete(parsed.conversationId);
              return;
            }
            if (parsed.error) {
              onError(new Error(parsed.error));
              return;
            }
          } catch {
            // Ignore parsing errors for non-JSON data
          }
        }
      }
    }
    onComplete("");
  } catch (error) {
    onError(error as Error);
  }
}