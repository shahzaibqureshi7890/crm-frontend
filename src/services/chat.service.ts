import { apiClient } from "@/lib/api-client";
import type {
  ChatListResponse,
  ConversationResponse,
  CreateConversationRequest,
  DeleteConversationResponse,
  DeleteMessageResponse,
  MessageResponse,
  MessagesResponse,
  SendMessageRequest,
} from "@/types/chat.types";
export const getConversations = async (): Promise<ChatListResponse> => {
  return apiClient<ChatListResponse>("/chat", {
    method: "GET",
  });
};
export const createConversation = async (
  data: CreateConversationRequest,
): Promise<ConversationResponse> => {
  return apiClient<ConversationResponse>("/chat", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
export const getConversationMessages = async (
  conversationId: number,
): Promise<MessagesResponse> => {
  return apiClient<MessagesResponse>(`/chat/${conversationId}/messages`, {
    method: "GET",
  });
};
export const sendMessage = async (
  conversationId: number,
  data: SendMessageRequest,
): Promise<MessageResponse> => {
  return apiClient<MessageResponse>(`/chat/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
export const sendFileMessage = async (
  conversationId: number,
  file: File,
  caption?: string,
  replyToMessageId?: number | null,
): Promise<MessageResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  if (caption?.trim()) {
    formData.append("caption", caption.trim());
  }
  if (replyToMessageId !== undefined && replyToMessageId !== null) {
    formData.append("replyToMessageId", String(replyToMessageId));
  }
  return apiClient<MessageResponse>(`/chat/${conversationId}/files`, {
    method: "POST",
    body: formData,
  });
};
export const downloadChatFile = async (fileId: number): Promise<Blob> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/chat/files/${fileId}/download`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!response.ok) {
    let message = "Unable to download file.";
    try {
      const data = (await response.json()) as {
        message?: string;
      };
      message = data.message || message;
    } catch {
      // Response was not JSON.
    }
    throw new Error(message);
  }
  return response.blob();
};
export const deleteMessage = async (
  messageId: number,
): Promise<DeleteMessageResponse> => {
  return apiClient<DeleteMessageResponse>(`/chat/messages/${messageId}`, {
    method: "DELETE",
  });
};
export const deleteConversation = async (
  conversationId: number,
): Promise<DeleteConversationResponse> => {
  return apiClient<DeleteConversationResponse>(`/chat/${conversationId}`, {
    method: "DELETE",
  });
};
