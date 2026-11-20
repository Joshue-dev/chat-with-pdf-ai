const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export interface UploadResponse {
  id: string;
  object: string;
  bytes: number;
  createdAt: number;
  filename: string;
  purpose: string;
  status: string;
  statusDetails?: string;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  fileIds?: string[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  content: string;
  role: string;
  finishReason: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ErrorResponse {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

export interface SuggestedQuestion {
  id: string;
  question: string;
}

export interface DocumentUploadResult {
  document: UploadResponse;
  suggestedQuestions: SuggestedQuestion[];
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
  formData.append("purpose", "assistants");

  const response = await fetch(`${API_BASE}/documents/upload`, {
    method: "POST",
    body: formData,
  });

  const document = await handleResponse<UploadResponse>(response);

  const questionsResponse = await fetch(`${API_BASE}/documents/${document.id}/suggested-questions`);
  const suggestedQuestions = await handleResponse<SuggestedQuestion[]>(questionsResponse);

  return { document, suggestedQuestions };
}

export async function createChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
  const response = await fetch(`${API_BASE}/documents/chat/with-files`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return handleResponse<ChatCompletionResponse>(response);
}

export async function createChatCompletionStream(
  request: ChatCompletionRequest,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void> {
  const response = await fetch(`${API_BASE}/documents/chat/with-files`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...request, stream: true }),
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
          if (data === "[DONE]") {
            onComplete();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              onChunk(parsed.content);
            }
          } catch {
            // Ignore parsing errors for non-JSON data
          }
        }
      }
    }
    onComplete();
  } catch (error) {
    onError(error as Error);
  }
}

export async function deleteDocument(id: string): Promise<{ id: string; deleted: boolean }> {
  const response = await fetch(`${API_BASE}/documents/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
}

export async function listDocuments(): Promise<UploadResponse[]> {
  const response = await fetch(`${API_BASE}/documents`);
  const data = await handleResponse<{ data: UploadResponse[] }>(response);
  return data.data;
}