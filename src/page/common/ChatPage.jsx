import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { getApiError } from "@/api/Apierror.js";
import {
    createChatClient,
    subscribeToChat,
    subscribeToChatErrors,
    subscribeToNotifications,
    sendChatMessage,
    closeChatClient,
} from "@/api/chatsocket.js";
import MessageBox from "@/component/MessageBox.jsx";
import NotificationBell from "@/component/NotificationBell.jsx";
import ChatWindow from "@/component/ChatWindow.jsx";

function ChatPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const clientRef = useRef(null);
    const subscriptionsRef = useRef(new Map());
    const errorTimerRef = useRef(null);

    const [myUserId, setMyUserId] = useState(null);
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorText, setErrorText] = useState("");
    const [pickedChatId, setPickedChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [showProfile, setShowProfile] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("connecting");
    const [isMobileListOpen, setIsMobileListOpen] = useState(true);

    const chatIdFromUrl = Number(searchParams.get("chatId")) || null;
    const selectedChatId = pickedChatId ?? chatIdFromUrl;
    const selectedChat = chats.find((chat) => chat.chatId === selectedChatId);
    const chatIdsKey = chats.map((chat) => chat.chatId).sort((a, b) => Number(a) - Number(b)).join(",");
    const myUserIdRef = useRef(myUserId);
    const selectedChatIdRef = useRef(selectedChatId);
    const chatsRef = useRef(chats);

    useEffect(() => {
        myUserIdRef.current = myUserId;
        selectedChatIdRef.current = selectedChatId;
        chatsRef.current = chats;
    }, [chats, myUserId, selectedChatId]);

    const showError = useCallback((text) => {
        setErrorText(text || "Something went wrong.");
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        errorTimerRef.current = setTimeout(() => setErrorText(""), 7000);
    }, []);

    const handleError = useCallback((error) => {
        const err = getApiError(error);
        if (err.status === 401) {
            localStorage.removeItem("my_app_token");
            navigate("/login");
            return;
        }
        showError(err.message || "Something went wrong.");
    }, [navigate, showError]);

    const markChatRead = useCallback(async (chatId) => {
        if (!chatId) return;
        try {
            await api.call(ENDPOINTS.CHAT.MARK_READ(chatId));
            setChats((prev) => prev.map((chat) => (
                chat.chatId === chatId ? { ...chat, unreadCount: 0 } : chat
            )));
        } catch (error) {
            handleError(error);
        }
    }, [handleError]);

    const disconnectSubscriptions = useCallback(() => {
        subscriptionsRef.current.forEach((subscription) => {
            try {
                subscription?.unsubscribe();
            } catch {
                // Ignore stale subscriptions during reconnect/cleanup.
            }
        });
        subscriptionsRef.current.clear();
    }, []);

    // Load the current user and all of their chats.
    useEffect(() => {
        let cancelled = false;

        const loadChats = async () => {
            setIsLoading(true);
            try {
                const me = await api.call(ENDPOINTS.ME.GET_PROFILE);
                const list = await api.call(ENDPOINTS.CHAT.LIST_CHATS);
                if (cancelled) return;
                setMyUserId(me.userId);
                setChats(Array.isArray(list) ? list : []);
            } catch (error) {
                if (!cancelled) handleError(error);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        loadChats();
        return () => {
            cancelled = true;
        };
    }, [chatIdFromUrl, handleError]);

    // Keep the URL-selected chat valid after the chat list arrives.
    useEffect(() => {
        setPickedChatId(null);
    }, [chatIdFromUrl]);

    useEffect(() => {
        if (chatIdFromUrl && chats.length > 0) {
            const exists = chats.some((chat) => chat.chatId === chatIdFromUrl);
            if (!exists) {
                showError("This chat is no longer available.");
                setPickedChatId(null);
                setMessages([]);
            }
        }
    }, [chatIdFromUrl, chats, showError]);

    // One STOMP/SockJS connection for the entire page.
    useEffect(() => {
        const client = createChatClient({
            onConnected: () => {
                setIsConnected(true);
                setConnectionStatus("connected");
                setErrorText("");
            },
            onError: (text, meta) => {
                if (meta?.isAuthError) {
                    localStorage.removeItem("my_app_token");
                    navigate("/login");
                    return;
                }
                if (meta?.type === "stomp") {
                    showError(text);
                    setConnectionStatus("error");
                } else {
                    setConnectionStatus("reconnecting");
                }
                setIsConnected(false);
            },
            onDisconnect: () => {
                setIsConnected(false);
                setConnectionStatus("reconnecting");
            },
        });

        clientRef.current = client;

        return () => {
            disconnectSubscriptions();
            closeChatClient(client);
            clientRef.current = null;
        };
    }, [disconnectSubscriptions, navigate, showError]);

    // Subscribe to every chat the user belongs to, not only the selected chat.
    // This gives the left list real-time unread counters and last-message updates.
    useEffect(() => {
        if (!isConnected || !clientRef.current || !chatIdsKey) return undefined;

        disconnectSubscriptions();
        const client = clientRef.current;

        chatsRef.current.forEach((chat) => {
            const subscription = subscribeToChat(
                client,
                chat.chatId,
                (newMessage) => {
                    const isOwnMessage = Number(newMessage.senderId) === Number(myUserIdRef.current);
                    const isSelected = Number(newMessage.chatId) === Number(selectedChatIdRef.current);

                    setChats((prev) => {
                        const next = prev.map((item) => {
                            if (item.chatId !== newMessage.chatId) return item;
                            return {
                                ...item,
                                lastMessage: newMessage.content,
                                updatedAt: newMessage.sentAt ?? item.updatedAt,
                                unreadCount: isSelected || isOwnMessage
                                    ? 0
                                    : Number(item.unreadCount ?? 0) + 1,
                            };
                        });
                        return [...next].sort((a, b) => {
                            const aTime = new Date(a.updatedAt ?? 0).getTime();
                            const bTime = new Date(b.updatedAt ?? 0).getTime();
                            return bTime - aTime;
                        });
                    });

                    if (isSelected) {
                        setMessages((prev) => (
                            prev.some((m) => m.messageId === newMessage.messageId)
                                ? prev
                                : [...prev, newMessage]
                        ));
                        void markChatRead(newMessage.chatId);
                    }
                },
                showError
            );
            if (subscription) subscriptionsRef.current.set(chat.chatId, subscription);
        });

        const errorSubscription = subscribeToChatErrors(
            client,
            (text) => showError(text),
            showError
        );
        if (errorSubscription) subscriptionsRef.current.set("errors", errorSubscription);

        if (myUserIdRef.current) {
            const notificationSubscription = subscribeToNotifications(
                client,
                myUserIdRef.current,
                (notification) => {
                    window.dispatchEvent(new CustomEvent("ranaswanu:notification", { detail: notification }));
                },
                showError
            );
            if (notificationSubscription) subscriptionsRef.current.set("notifications", notificationSubscription);
        }

        return () => disconnectSubscriptions();
    }, [chatIdsKey, disconnectSubscriptions, isConnected, markChatRead, myUserId, showError]);

    // Load message history whenever the selected chat changes and mark it read.
    useEffect(() => {
        if (!selectedChatId) return undefined;
        let cancelled = false;

        const loadMessages = async () => {
            try {
                const list = await api.call(ENDPOINTS.CHAT.LIST_MESSAGES(selectedChatId));
                if (!cancelled) setMessages(Array.isArray(list) ? list : []);
                if (!cancelled) await markChatRead(selectedChatId);
            } catch (error) {
                if (!cancelled) handleError(error);
            }
        };

        loadMessages();
        return () => {
            cancelled = true;
        };
    }, [handleError, markChatRead, selectedChatId]);

    // Opening a chat on a phone switches from the list to the conversation.
    useEffect(() => {
        if (selectedChatId) setIsMobileListOpen(false);
    }, [selectedChatId]);

    useEffect(() => () => {
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    }, []);

    const handleSelectChat = (chatId) => {
        setPickedChatId(chatId);
        setMessages([]);
        setShowProfile(false);
        setErrorText("");
        setIsMobileListOpen(false);
    };

    const handleBackToList = () => {
        setIsMobileListOpen(true);
        setShowProfile(false);
    };

    const handleSend = (text) => {
        try {
            sendChatMessage(clientRef.current, selectedChatId, text);
            setErrorText("");
        } catch (error) {
            showError(error instanceof Error ? error.message : "Chat is not connected yet.");
        }
    };

    const statusLabel = connectionStatus === "connected"
        ? "Connected"
        : connectionStatus === "reconnecting"
            ? "Reconnecting…"
            : connectionStatus === "error"
                ? "Connection error"
                : "Connecting…";

    return (
        <div className="h-[100dvh] w-full overflow-hidden bg-slate-50 text-slate-900">
            <div className="flex h-full min-h-0 w-full">
                {/* Chat list */}
                <aside
                    className={`${isMobileListOpen ? "flex" : "hidden"} md:flex w-full md:w-[320px] lg:w-[360px] shrink-0 min-h-0 flex-col border-r border-slate-200 bg-white`}
                >
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5 sm:py-4">
                        <div className="min-w-0">
                            <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">Chats</h1>
                            <p className="text-xs text-slate-400">{chats.length} conversation{chats.length === 1 ? "" : "s"}</p>
                        </div>
                        <NotificationBell useOwnSocket={false} />
                    </div>

                    <div className="px-4 pt-3 sm:px-5">
                        {errorText && <MessageBox type="error" text={errorText} />}
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3 sm:px-3">
                        {isLoading && <p className="px-3 py-4 text-sm text-slate-500">Loading chats…</p>}
                        {!isLoading && chats.length === 0 && !errorText && (
                            <p className="px-3 py-8 text-center text-sm text-slate-500">No chats yet.</p>
                        )}

                        {chats.map((chat) => {
                            const unreadCount = Number(chat.unreadCount ?? 0);
                            return (
                                <button
                                    key={chat.chatId}
                                    type="button"
                                    onClick={() => handleSelectChat(chat.chatId)}
                                    className={`my-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-slate-50 ${
                                        chat.chatId === selectedChatId ? "bg-green-50" : ""
                                    }`}
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 font-semibold text-green-700">
                                        {(chat.otherUserName ?? "?").charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="truncate text-sm font-semibold text-slate-800">
                                                {chat.otherUserName ?? "Unknown user"}
                                            </p>
                                            {unreadCount > 0 && (
                                                <span className="min-w-5 rounded-full bg-green-600 px-1.5 py-0.5 text-center text-[11px] font-bold text-white">
                                                    {unreadCount > 99 ? "99+" : unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <p className="truncate text-xs text-slate-500">
                                            {chat.lastMessage ?? "No messages yet"}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* Conversation */}
                <main className={`${!isMobileListOpen ? "flex" : "hidden"} md:flex min-w-0 flex-1 flex-col bg-slate-50`}>
                    {selectedChat ? (
                        <ChatWindow
                            chat={selectedChat}
                            messages={messages}
                            myUserId={myUserId}
                            canSend={isConnected}
                            connectionStatus={statusLabel}
                            errorText={errorText}
                            onBack={handleBackToList}
                            onSend={handleSend}
                            onOpenProfile={() => setShowProfile(true)}
                        />
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl">
                                💬
                            </div>
                            <p className="text-base font-semibold text-slate-700">Select a chat to start</p>
                            <p className="mt-1 max-w-sm text-sm text-slate-500">
                                Your conversations and unread messages will appear here.
                            </p>
                        </div>
                    )}
                </main>

                {/* Contact info */}
                {showProfile && selectedChat && (
                    <div className="absolute inset-0 z-30 flex bg-black/30 md:static md:inset-auto md:z-auto md:flex md:w-80 md:shrink-0 md:bg-white">
                        <div className="ml-auto h-full w-full max-w-sm border-l border-slate-200 bg-white p-5 shadow-xl md:w-full md:max-w-none md:shadow-none">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <span className="text-sm font-semibold text-slate-700">Contact info</span>
                                <button
                                    type="button"
                                    onClick={() => setShowProfile(false)}
                                    className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100"
                                    aria-label="Close contact info"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="flex flex-col items-center pt-8 text-center">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-3xl font-semibold text-green-700">
                                    {(selectedChat.otherUserName ?? "?").charAt(0).toUpperCase()}
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-slate-800">{selectedChat.otherUserName}</h3>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatPage;
