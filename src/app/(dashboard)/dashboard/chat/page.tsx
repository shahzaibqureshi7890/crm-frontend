"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  Smile,
  X,
} from "lucide-react";
import {
  createConversation,
  downloadChatFile,
  getConversationMessages,
  getConversations,
  sendFileMessage,
} from "@/services/chat.service";
import { getUsers } from "@/services/user.service";
import type { Conversation, Message } from "@/types/chat.types";
import type { User } from "@/types/user.types";
import { showAppToast } from "@/components/ui/app-toast";
import { useCurrentUser } from "@/hooks/use-current-user";
import { connectSocket } from "@/services/socket.service";
import AppModal from "@/components/ui/app-modal";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
const MAX_CHAT_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_CHAT_FILE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
]);
const getInitials = (name: string): string => {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U"
  );
};
const formatMessageTime = (date: string): string => {
  return new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};
const formatConversationTime = (date: string): string => {
  return new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};
export default function ChatPage() {
  const { user } = useCurrentUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
  const [openMessageMenuId, setOpenMessageMenuId] = useState<number | null>(
    null,
  );
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<number[]>([]);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSendingFile, setIsSendingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    let isMounted = true;
    const loadConversations = async () => {
      setIsLoadingConversations(true);
      try {
        const response = await getConversations();
        if (!isMounted) {
          return;
        }
        setConversations(response.conversations);
        setSelectedConversationId(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Unable to load conversations.";
        showAppToast("error", errorMessage);
      } finally {
        if (isMounted) {
          setIsLoadingConversations(false);
        }
      }
    };
    void loadConversations();
    return () => {
      isMounted = false;
    };
  }, []);
  useEffect(() => {
    let isMounted = true;
    const loadMessages = async () => {
      if (!selectedConversationId) {
        setMessages([]);
        setReplyingTo(null);
        return;
      }
      setIsLoadingMessages(true);
      setMessages([]);
      setReplyingTo(null);
      setOpenMessageMenuId(null);
      setIsEmojiPickerOpen(false);
      try {
        const response = await getConversationMessages(selectedConversationId);
        if (!isMounted) {
          return;
        }
        setMessages(response.messages);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        const errorMessage =
          error instanceof Error ? error.message : "Unable to load messages.";
        showAppToast("error", errorMessage);
      } finally {
        if (isMounted) {
          setIsLoadingMessages(false);
        }
      }
    };
    void loadMessages();
    return () => {
      isMounted = false;
    };
  }, [selectedConversationId]);
  useEffect(() => {
    const socket = connectSocket();
    const handleNewMessage = async (newMessage: Message) => {
      try {
        const conversationsResponse = await getConversations();
        setConversations(conversationsResponse.conversations);
        if (newMessage.conversationId !== selectedConversationId) {
          return;
        }
        setMessages((currentMessages) => {
          if (currentMessages.some((item) => item.id === newMessage.id)) {
            return currentMessages;
          }
          return [...currentMessages, newMessage];
        });
      } catch {
        // Conversation list refresh failed; existing chat state remains unchanged.
      }
    };
    const handleMessageDeleted = (
      deletedMessage: Message & {
        deletedAt?: string | null;
      },
    ) => {
      setMessages((currentMessages) =>
        currentMessages.map((item) => {
          if (item.id === deletedMessage.id) {
            return {
              ...item,
              isDeleted: true,
              deletedAt: deletedMessage.deletedAt ?? item.deletedAt,
              content: "This message was deleted",
            };
          }
          if (item.replyTo?.id === deletedMessage.id) {
            return {
              ...item,
              replyTo: {
                ...item.replyTo,
                isDeleted: true,
                content: "This message was deleted",
              },
            };
          }
          return item;
        }),
      );
      setConversations((currentConversations) =>
        currentConversations.map((conversation) => {
          if (conversation.id !== deletedMessage.conversationId) {
            return conversation;
          }
          if (!conversation.lastMessage) {
            return conversation;
          }
          if (conversation.lastMessage.id === deletedMessage.id) {
            return {
              ...conversation,
              updatedAt: conversation.lastMessage.createdAt,
              lastMessage: {
                ...conversation.lastMessage,
                isDeleted: true,
                deletedAt:
                  deletedMessage.deletedAt ??
                  conversation.lastMessage.deletedAt,
                content: "This message was deleted",
              },
            };
          }
          if (conversation.lastMessage.replyTo?.id === deletedMessage.id) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                replyTo: {
                  ...conversation.lastMessage.replyTo,
                  isDeleted: true,
                  content: "This message was deleted",
                },
              },
            };
          }
          return conversation;
        }),
      );
    };
    const handleChatError = (error: { message?: string }) => {
      showAppToast("error", error.message || "Unable to connect to chat.");
    };
    socket.on("new_message", handleNewMessage);
    socket.on("message_sent", handleNewMessage);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("online_users", (data: { userIds: number[] }) => {
      setOnlineUserIds(data.userIds);
    });
    socket.on("user_online", (data: { userId: number }) => {
      setOnlineUserIds((currentIds) =>
        currentIds.includes(data.userId)
          ? currentIds
          : [...currentIds, data.userId],
      );
    });
    socket.on("user_offline", (data: { userId: number }) => {
      setOnlineUserIds((currentIds) =>
        currentIds.filter((id) => id !== data.userId),
      );
    });
    socket.on("chat_error", handleChatError);
    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_sent", handleNewMessage);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("chat_error", handleChatError);
      socket.off("online_users");
      socket.off("user_online");
      socket.off("user_offline");
    };
  }, [selectedConversationId]);
  const selectedConversation = useMemo(() => {
    return (
      conversations.find(
        (conversation) => conversation.id === selectedConversationId,
      ) ?? null
    );
  }, [conversations, selectedConversationId]);
  const filteredConversations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) {
      return conversations;
    }
    return conversations.filter((conversation) => {
      const name = conversation.otherUser.name.toLowerCase();
      const email = conversation.otherUser.email.toLowerCase();
      const lastMessage =
        conversation.lastMessage?.content?.toLowerCase() ?? "";
      return (
        name.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        lastMessage.includes(normalizedSearch)
      );
    });
  }, [conversations, search]);
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((currentMessage) => `${currentMessage}${emojiData.emoji}`);
    setIsEmojiPickerOpen(false);
  };
  const handleReplyToMessage = (selectedMessage: Message) => {
    if (selectedMessage.senderId === user?.id) {
      return;
    }
    setReplyingTo(selectedMessage);
    setOpenMessageMenuId(null);
    setIsEmojiPickerOpen(false);
    window.setTimeout(() => {
      messageInputRef.current?.focus();
    }, 0);
  };
  const handleCancelReply = () => {
    setReplyingTo(null);
    setOpenMessageMenuId(null);
    window.setTimeout(() => {
      messageInputRef.current?.focus();
    }, 0);
  };
  const getReplySenderName = (reply: Message["replyTo"]): string => {
    if (!reply) {
      return "";
    }
    if (reply.senderId === user?.id) {
      return "You";
    }
    return selectedConversation?.otherUser.name ?? "User";
  };
  const handleFileSelect = (file: File | undefined) => {
    if (!file) {
      return;
    }
    if (file.size > MAX_CHAT_FILE_SIZE) {
      showAppToast("error", "File size cannot exceed 10 MB.");
      return;
    }
    if (!ALLOWED_CHAT_FILE_TYPES.has(file.type)) {
      showAppToast("error", "This file type is not supported.");
      return;
    }
    setSelectedFile(file);
    setIsEmojiPickerOpen(false);
  };
  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleSendFile = async () => {
    if (!selectedFile || !selectedConversationId || isSendingFile) {
      return;
    }
    setIsSendingFile(true);
    try {
      const response = await sendFileMessage(
        selectedConversationId,
        selectedFile,
        message,
        replyingTo?.id ?? null,
      );
      setMessages((currentMessages) => {
        if (currentMessages.some((item) => item.id === response.data.id)) {
          return currentMessages;
        }
        return [...currentMessages, response.data];
      });
      setConversations((currentConversations) =>
        currentConversations.map((conversation) =>
          conversation.id === selectedConversationId
            ? {
                ...conversation,
                updatedAt: response.data.createdAt,
                lastMessage: response.data,
              }
            : conversation,
        ),
      );
      setMessage("");
      setSelectedFile(null);
      setReplyingTo(null);
      setIsEmojiPickerOpen(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      showAppToast("success", "File sent successfully.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to send file.";
      showAppToast("error", errorMessage);
    } finally {
      setIsSendingFile(false);
    }
  };
  const handleDownloadChatFile = async (fileId: number, fileName: string) => {
    try {
      const blob = await downloadChatFile(fileId);
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
      setMessages((currentMessages) =>
        currentMessages.map((item) =>
          item.file?.id === fileId && item.file.downloadedAt === null
            ? {
                ...item,
                file: {
                  ...item.file,
                  downloadedAt: new Date().toISOString(),
                },
              }
            : item,
        ),
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to download file.";
      showAppToast("error", errorMessage);
    }
  };
  const handleOpenChatFile = async (fileId: number) => {
    try {
      const blob = await downloadChatFile(fileId);
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, "_blank", "noopener,noreferrer");
      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 60_000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to open file.";
      showAppToast("error", errorMessage);
    }
  };
  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !selectedConversationId || isSendingMessage) {
      return;
    }
    setIsSendingMessage(true);
    try {
      const socket = connectSocket();
      socket.emit("send_message", {
        conversationId: selectedConversationId,
        content: trimmedMessage,
        replyToMessageId: replyingTo?.id ?? null,
      });
      setMessage("");
      setReplyingTo(null);
      setIsEmojiPickerOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to send message.";
      showAppToast("error", errorMessage);
    } finally {
      setIsSendingMessage(false);
    }
  };
  const handleDeleteMessage = (messageId: number) => {
    try {
      const socket = connectSocket();
      socket.emit("delete_message", {
        messageId,
      });
      showAppToast("success", "Message deleted.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to delete message.";
      showAppToast("error", errorMessage);
    }
  };
  const handleOpenNewChat = async () => {
    setIsNewChatModalOpen(true);
    setUserSearch("");
    if (users.length > 0) {
      return;
    }
    setIsLoadingUsers(true);
    try {
      const response = await getUsers();
      setUsers(response.users);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to load users.";
      showAppToast("error", errorMessage);
    } finally {
      setIsLoadingUsers(false);
    }
  };
  const handleStartConversation = async (userId: number) => {
    if (isCreatingConversation) {
      return;
    }
    setIsCreatingConversation(true);
    try {
      const response = await createConversation({
        otherUserId: userId,
      });
      const conversationsResponse = await getConversations();
      setConversations(conversationsResponse.conversations);
      setSelectedConversationId(response.conversation.id);
      setReplyingTo(null);
      setIsNewChatModalOpen(false);
      setUserSearch("");
      showAppToast("success", "Chat opened successfully.");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to start conversation.";
      showAppToast("error", errorMessage);
    } finally {
      setIsCreatingConversation(false);
    }
  };
  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    if (!query) {
      return users;
    }
    return users.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query),
    );
  }, [users, userSearch]);
  return (
    <div className="flex h-[calc(100dvh-60px)] min-h-0 flex-col overflow-hidden bg-[var(--background)] p-2 sm:p-4 lg:h-[100dvh] lg:p-5">
      <div className="flex min-h-0 flex-1 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <aside
          className={`flex min-h-0 w-full shrink-0 flex-col border-[var(--color-border)] md:w-[300px] md:max-w-[340px] md:border-r ${
            selectedConversationId ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="border-b border-[var(--color-border)] px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-sm font-semibold text-[var(--foreground)] sm:text-base">
                  Messages
                </h1>
                <p className="mt-0.5 text-[10px] text-[var(--color-muted)]">
                  Chat with your team
                </p>
              </div>
              <button
                type="button"
                aria-label="New conversation"
                onClick={() => {
                  void handleOpenNewChat();
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white outline-none transition-colors duration-300 hover:bg-[var(--color-primary-dark)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
              >
                <MessageCircle size={15} strokeWidth={2} />
              </button>
            </div>
            <div className="relative mt-4">
              <Search
                size={15}
                strokeWidth={2}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search conversations..."
                className="h-9 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] pl-9 pr-3 text-[11px] text-[var(--foreground)] outline-none placeholder:text-[var(--color-muted)] transition-colors duration-300 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)]"
              />
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {isLoadingConversations ? (
              <div className="flex h-full items-center justify-center px-6">
                <div className="text-center">
                  <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />
                  <p className="mt-3 text-[9px] text-[var(--color-muted)]">
                    Loading conversations...
                  </p>
                </div>
              </div>
            ) : filteredConversations.length > 0 ? (
              <div className="divide-y divide-[var(--color-border)]">
                {filteredConversations.map((conversation) => {
                  const isSelected = conversation.id === selectedConversationId;
                  const initials = getInitials(conversation.otherUser.name);
                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() => {
                        setSelectedConversationId(conversation.id);
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left outline-none transition-colors duration-200 ${
                        isSelected
                          ? "bg-[var(--color-primary-light)]"
                          : "hover:bg-[var(--color-surface-soft)]"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[10px] font-semibold text-[var(--color-primary)]">
                          {initials}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="flex min-w-0 items-center gap-1.5 truncate text-[11px] font-semibold text-[var(--foreground)]">
                            <span
                              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                onlineUserIds.includes(
                                  conversation.otherUser.id,
                                )
                                  ? "bg-[var(--color-success)]"
                                  : "bg-[var(--color-muted)]"
                              }`}
                            />
                            <span className="truncate">
                              {conversation.otherUser.name}
                            </span>
                          </p>
                          <span className="shrink-0 text-[8px] text-[var(--color-muted)]">
                            {conversation.lastMessage?.createdAt
                              ? formatConversationTime(
                                  conversation.lastMessage.createdAt,
                                )
                              : ""}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-[9px] text-[var(--color-muted)]">
                          {conversation.lastMessage?.isDeleted
                            ? "This message was deleted"
                            : conversation.lastMessage?.content ||
                              "No messages yet"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center">
                <div>
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-soft)] text-[var(--color-muted)]">
                    <Search size={17} />
                  </div>
                  <p className="mt-3 text-[11px] font-semibold text-[var(--foreground)]">
                    {search.trim()
                      ? "No conversations found"
                      : "No conversations yet"}
                  </p>
                  <p className="mt-1 text-[9px] text-[var(--color-muted)]">
                    {search.trim()
                      ? "Try a different search."
                      : "Start a conversation with a team member."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </aside>
        <section
          className={`min-w-0 flex-1 flex-col ${
            selectedConversationId ? "flex" : "hidden md:flex"
          }`}
        >
          {selectedConversation ? (
            <>
              <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-[var(--color-border)] px-4 sm:px-5">
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedConversationId(null)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--color-muted)] outline-none transition-colors duration-300 hover:bg-[var(--color-surface-soft)] hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] md:hidden"
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft size={17} strokeWidth={2} />
                  </button>
                  <div className="relative shrink-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[10px] font-semibold text-[var(--color-primary)]">
                      {getInitials(selectedConversation.otherUser.name)}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-[11px] font-semibold text-[var(--foreground)]">
                      {selectedConversation.otherUser.name}
                    </h2>
                    <p className="mt-0.5 flex items-center gap-1.5 truncate text-[9px] text-[var(--color-muted)]">
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          onlineUserIds.includes(
                            selectedConversation.otherUser.id,
                          )
                            ? "bg-[var(--color-success)]"
                            : "bg-[var(--color-muted)]"
                        }`}
                      />
                      {onlineUserIds.includes(selectedConversation.otherUser.id)
                        ? "Online"
                        : "Offline"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Conversation options"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-muted)] outline-none transition-colors duration-300 hover:bg-[var(--color-surface-soft)] hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                >
                  <MoreVertical size={17} strokeWidth={2} />
                </button>
              </header>
              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[var(--background)] px-3 py-4 sm:px-6 sm:py-5">
                {isLoadingMessages ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />
                      <p className="mt-3 text-[9px] text-[var(--color-muted)]">
                        Loading messages...
                      </p>
                    </div>
                  </div>
                ) : messages.length > 0 ? (
                  <div className="mx-auto flex max-w-3xl flex-col gap-3">
                    {messages.map((item) => {
                      const isOwnMessage = item.senderId === user?.id;
                      const replySenderName = getReplySenderName(item.replyTo);
                      return (
                        <div
                          key={item.id}
                          className={`flex ${
                            isOwnMessage ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`group relative min-w-0 max-w-[88%] rounded-2xl px-3.5 py-2.5 sm:max-w-[78%] ${
                              isOwnMessage
                                ? "rounded-br-md bg-[var(--color-primary)] text-white"
                                : "rounded-bl-md bg-[var(--color-surface)] text-[var(--foreground)] shadow-sm"
                            }`}
                          >
                            {isOwnMessage && !item.isDeleted ? (
                              <button
                                type="button"
                                aria-label="Message options"
                                onClick={() => {
                                  setOpenMessageMenuId((currentId) =>
                                    currentId === item.id ? null : item.id,
                                  );
                                }}
                                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md text-current opacity-0 outline-none transition-all duration-200 group-hover:opacity-70 hover:bg-black/10 hover:opacity-100 focus-visible:opacity-100"
                              >
                                <MoreVertical size={13} strokeWidth={2} />
                              </button>
                            ) : null}
                            {!isOwnMessage ? (
                              <button
                                type="button"
                                aria-label="Message options"
                                onClick={() => {
                                  setOpenMessageMenuId((currentId) =>
                                    currentId === item.id ? null : item.id,
                                  );
                                }}
                                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md text-current opacity-0 outline-none transition-all duration-200 group-hover:opacity-70 hover:bg-black/10 hover:opacity-100 focus-visible:opacity-100"
                              >
                                <MoreVertical size={13} strokeWidth={2} />
                              </button>
                            ) : null}
                            {isOwnMessage &&
                            !item.isDeleted &&
                            openMessageMenuId === item.id ? (
                              <div className="absolute right-1 top-8 z-20 min-w-[100px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-lg">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMessageToDelete(item.id);
                                    setOpenMessageMenuId(null);
                                    setIsDeleteModalOpen(true);
                                  }}
                                  className="w-full rounded-md px-3 py-2 text-left text-[10px] font-medium text-[var(--color-danger)] transition-colors duration-200 hover:bg-[var(--color-primary-light)]"
                                >
                                  Delete
                                </button>
                              </div>
                            ) : null}
                            {!isOwnMessage && openMessageMenuId === item.id ? (
                              <div className="absolute right-1 top-8 z-20 min-w-[100px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-lg">
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleReplyToMessage(item);
                                  }}
                                  className="w-full rounded-md px-3 py-2 text-left text-[10px] font-medium text-[var(--foreground)] transition-colors duration-200 hover:bg-[var(--color-primary-light)]"
                                >
                                  Reply
                                </button>
                              </div>
                            ) : null}
                            {item.replyTo ? (
                              <div
                                className={`mb-2 rounded-lg border-l-2 px-2.5 py-1.5 ${
                                  isOwnMessage
                                    ? "border-white/60 bg-white/10"
                                    : "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
                                }`}
                              >
                                <p
                                  className={`text-[8px] font-semibold ${
                                    isOwnMessage
                                      ? "text-white/80"
                                      : "text-[var(--color-primary)]"
                                  }`}
                                >
                                  {replySenderName}
                                </p>
                                <p
                                  className={`mt-0.5 line-clamp-2 whitespace-pre-wrap break-words text-[9px] leading-3.5 ${
                                    item.replyTo.isDeleted
                                      ? isOwnMessage
                                        ? "italic text-white/60"
                                        : "italic text-[var(--color-muted)]"
                                      : isOwnMessage
                                        ? "text-white/75"
                                        : "text-[var(--color-muted)]"
                                  }`}
                                >
                                  {item.replyTo.isDeleted
                                    ? "This message was deleted"
                                    : item.replyTo.content}
                                </p>
                              </div>
                            ) : null}
                            {item.messageType === "file" &&
                            item.file &&
                            !item.isDeleted ? (
                              <div className="mb-1.5 w-full min-w-0 max-w-[260px] rounded-lg border border-current/10 bg-black/5 p-2.5">
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                      isOwnMessage
                                        ? "bg-white/15 text-white"
                                        : "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                                    }`}
                                  >
                                    <Paperclip size={15} strokeWidth={2} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="break-all text-[9px] font-semibold">
                                      {item.file.originalName}
                                    </p>
                                    <p
                                      className={`mt-0.5 text-[8px] ${
                                        isOwnMessage
                                          ? "text-white/60"
                                          : "text-[var(--color-muted)]"
                                      }`}
                                    >
                                      {(
                                        item.file.fileSize /
                                        1024 /
                                        1024
                                      ).toFixed(2)}{" "}
                                      MB
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isOwnMessage) {
                                      void handleOpenChatFile(item.file!.id);
                                      return;
                                    }
                                    if (item.file!.downloadedAt) {
                                      void handleOpenChatFile(item.file!.id);
                                      return;
                                    }
                                    void handleDownloadChatFile(
                                      item.file!.id,
                                      item.file!.originalName,
                                    );
                                  }}
                                  className={`mt-2.5 w-full rounded-md px-2.5 py-1.5 text-[9px] font-semibold transition-colors duration-200 ${
                                    isOwnMessage
                                      ? "bg-white/15 text-white hover:bg-white/20"
                                      : "bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                                  }`}
                                >
                                  {isOwnMessage || item.file.downloadedAt
                                    ? "Open"
                                    : "Download"}
                                </button>
                              </div>
                            ) : null}
                            {item.content ? (
                              <p
                                className={`whitespace-pre-wrap break-words text-[10px] leading-4 ${
                                  item.isDeleted ? "italic opacity-75" : ""
                                }`}
                              >
                                {item.isDeleted
                                  ? "This message was deleted"
                                  : item.content}
                              </p>
                            ) : null}
                            <p
                              className={`mt-1 text-[8px] ${
                                isOwnMessage
                                  ? "text-white/70"
                                  : "text-[var(--color-muted)]"
                              }`}
                            >
                              {formatMessageTime(item.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-center">
                    <div>
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                        <MessageCircle size={21} strokeWidth={2} />
                      </div>
                      <h3 className="mt-4 text-sm font-semibold text-[var(--foreground)]">
                        No messages yet
                      </h3>
                      <p className="mt-1 max-w-[280px] text-[9px] leading-4 text-[var(--color-muted)]">
                        Send a message to start this conversation.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="shrink-0 border-t border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:p-4">
                <div className="mx-auto max-w-3xl">
                  {replyingTo ? (
                    <div className="mb-2 flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-2">
                      <div className="min-w-0 flex-1 border-l-2 border-[var(--color-primary)] pl-2.5">
                        <p className="text-[8px] font-semibold text-[var(--color-primary)]">
                          Replying to{" "}
                          {replyingTo.senderId === user?.id
                            ? "You"
                            : selectedConversation.otherUser.name}
                        </p>
                        <p
                          className={`mt-0.5 line-clamp-2 text-[9px] leading-3.5 ${
                            replyingTo.isDeleted
                              ? "italic text-[var(--color-muted)]"
                              : "text-[var(--foreground)]"
                          }`}
                        >
                          {replyingTo.isDeleted
                            ? "This message was deleted"
                            : replyingTo.content}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="Cancel reply"
                        onClick={handleCancelReply}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--color-muted)] outline-none transition-colors duration-200 hover:bg-[var(--color-surface)] hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                      >
                        <X size={14} strokeWidth={2} />
                      </button>
                    </div>
                  ) : null}
                  {selectedFile ? (
                    <div className="mb-2 flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[9px] font-semibold text-[var(--foreground)]">
                          {selectedFile.name}
                        </p>
                        <p className="mt-0.5 text-[8px] text-[var(--color-muted)]">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove selected file"
                        disabled={isSendingFile}
                        onClick={handleRemoveSelectedFile}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--color-muted)] transition-colors duration-200 hover:bg-[var(--color-surface)] hover:text-[var(--foreground)] disabled:opacity-60"
                      >
                        <X size={14} strokeWidth={2} />
                      </button>
                    </div>
                  ) : null}
                  <div className="flex min-w-0 items-end gap-1.5 sm:gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.txt,.csv,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
                      onChange={(event) => {
                        handleFileSelect(event.target.files?.[0]);
                      }}
                    />
                    <button
                      type="button"
                      aria-label="Attach file"
                      disabled={isSendingMessage || isSendingFile}
                      onClick={() => fileInputRef.current?.click()}
                      className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--color-muted)] outline-none transition-colors duration-300 hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Paperclip size={16} strokeWidth={2} />
                    </button>
                    <div className="relative flex min-h-9 flex-1 items-end rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] transition-colors duration-300 focus-within:border-[var(--color-primary)] focus-within:bg-[var(--color-surface)]">
                      <input
                        ref={messageInputRef}
                        type="text"
                        value={message}
                        disabled={isSendingMessage}
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            void handleSendMessage();
                          }
                        }}
                        placeholder="Write a message..."
                        className="h-9 min-w-0 flex-1 bg-transparent px-3 text-[10px] text-[var(--foreground)] outline-none placeholder:text-[var(--color-muted)] disabled:opacity-60"
                      />
                      {isEmojiPickerOpen ? (
                        <div className="absolute bottom-12 right-0 z-30 max-w-[calc(100vw-1rem)] overflow-hidden rounded-lg">
                          <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            width="min(320px, calc(100vw - 1rem))"
                            height={380}
                            searchDisabled={false}
                            previewConfig={{ showPreview: false }}
                          />
                        </div>
                      ) : null}
                      <button
                        type="button"
                        aria-label="Add emoji"
                        disabled={isSendingMessage}
                        onClick={() =>
                          setIsEmojiPickerOpen((current) => !current)
                        }
                        className="mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--color-muted)] outline-none transition-colors duration-300 hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Smile size={15} strokeWidth={2} />
                      </button>
                    </div>
                    <button
                      type="button"
                      aria-label="Send message"
                      disabled={
                        (!message.trim() && !selectedFile) ||
                        isSendingMessage ||
                        isSendingFile
                      }
                      onClick={() => {
                        if (selectedFile) {
                          void handleSendFile();
                          return;
                        }
                        void handleSendMessage();
                      }}
                      className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white outline-none transition-colors duration-300 hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                    >
                      {isSendingMessage || isSendingFile ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      ) : (
                        <Send size={15} strokeWidth={2} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center bg-[var(--background)] px-6 text-center">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                  <MessageCircle size={21} strokeWidth={2} />
                </div>
                <h2 className="mt-4 text-sm font-semibold text-[var(--foreground)]">
                  No conversation selected
                </h2>
                <p className="mx-auto mt-1 max-w-[250px] text-[9px] leading-4 text-[var(--color-muted)]">
                  Select a conversation from the list to start messaging.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
      <AppModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMessageToDelete(null);
        }}
        title="Delete Message"
        size="sm"
      >
        <p className="text-sm text-[var(--color-muted)]">
          Are you sure you want to delete this message?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setMessageToDelete(null);
            }}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[var(--foreground)] transition-colors duration-300 hover:bg-[var(--color-primary-light)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (messageToDelete !== null) {
                handleDeleteMessage(messageToDelete);
              }
              setIsDeleteModalOpen(false);
              setMessageToDelete(null);
            }}
            className="rounded-lg bg-[var(--color-danger)] px-4 py-2 text-xs font-medium text-white transition-colors duration-300 hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </AppModal>
      <AppModal
        isOpen={isNewChatModalOpen}
        onClose={() => {
          if (!isCreatingConversation) {
            setIsNewChatModalOpen(false);
            setUserSearch("");
          }
        }}
        title="New Chat"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <div className="relative">
              <Search
                size={15}
                strokeWidth={2}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
              />
              <input
                type="text"
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
                placeholder="Search by name or email..."
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pl-9 pr-3 text-xs text-[var(--foreground)] outline-none transition-colors duration-300 placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
          <div className="max-h-[360px] overflow-y-auto">
            {isLoadingUsers ? (
              <div className="flex items-center justify-center py-10">
                <p className="text-xs text-[var(--color-muted)]">
                  Loading users...
                </p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <p className="text-xs text-[var(--color-muted)]">
                  {userSearch
                    ? "No users found."
                    : "No registered users available."}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredUsers.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isCreatingConversation}
                    onClick={() => {
                      void handleStartConversation(item.id);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-200 hover:bg-[var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-xs font-semibold text-[var(--color-primary)]">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[var(--foreground)]">
                        {item.name}
                      </p>
                      <p className="truncate text-[10px] text-[var(--color-muted)]">
                        {item.email}
                      </p>
                      <div className="flex items-center gap-1.5 text-[9px] text-[var(--color-muted)]">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            onlineUserIds.includes(item.id)
                              ? "bg-[var(--color-success)]"
                              : "bg-[var(--color-muted)]"
                          }`}
                        />
                        {onlineUserIds.includes(item.id) ? "Online" : "Offline"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {isCreatingConversation ? (
            <p className="text-center text-[10px] text-[var(--color-muted)]">
              Opening chat...
            </p>
          ) : null}
        </div>
      </AppModal>
    </div>
  );
}
