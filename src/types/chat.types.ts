export type ChatUser = {
  id: number;
  name: string;
  email: string;
};
export type MessageReply = {
  id: number;
  senderId: number;
  content: string;
  isDeleted: boolean;
  createdAt: string;
};
export type MessageFile = {
  id: number;
  originalName: string;
  mimeType: string;
  fileSize: number;
  downloadedAt: string | null;
};
export type Conversation = {
  id: number;
  createdAt: string;
  updatedAt: string;
  otherUser: ChatUser;
  lastMessage: Message | null;
};
export type Message = {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  replyToMessageId: number | null;
  replyTo: MessageReply | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  messageType: "text" | "file";
  file: MessageFile | null;
};
export type CreateConversationRequest = {
  otherUserId: number;
};
export type SendMessageRequest = {
  content: string;
  replyToMessageId?: number | null;
};
export type ChatListResponse = {
  success: boolean;
  message: string;
  conversations: Conversation[];
};
export type ConversationResponse = {
  success: boolean;
  message: string;
  conversation: Conversation;
};
export type MessagesResponse = {
  success: boolean;
  message: string;
  messages: Message[];
};
export type MessageResponse = {
  success: boolean;
  message: string;
  data: Message;
};
export type DeleteMessageResponse = {
  success: boolean;
  message: string;
};
export type DeleteConversationResponse = {
  success: boolean;
  message: string;
};
