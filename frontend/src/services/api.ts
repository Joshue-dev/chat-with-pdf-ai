import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:3000/api/v1";

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

export const uploadDocument = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post<UploadResponse>(
    `${API_BASE}/chat/upload`,
    formData,
  );
  return response.data;
};
