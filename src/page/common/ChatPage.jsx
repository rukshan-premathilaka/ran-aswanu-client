import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { getApiError } from "@/api/Apierror.js";
import { createChatClient, subscribeToChat, subscribeToChatErrors, sendChatMessage, closeChatClient } from "@/api/chatsocket.js";
import MessageBox from "@/component/MessageBox.jsx";
import NotificationBell from "@/component/NotificationBell.jsx";
import ChatWindow from "@/component/ChatWindow.jsx";

function ChatPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const clientRef = useRef(null);
    const [myUserId, setMyUserId] = useState(null);
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorText, setErrorText] = useState("");
    const chatIdFromUrl = Number(searchParams.get("chatId")) || null;
    const [pickedChatId, setPickedChatId] = useState(null);
    const selectedChatId = pickedChatId ?? chatIdFromUrl;
    const [messages, setMessages] = useState([]);
    const [showProfile, setShowProfile] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const selectedChat = chats.find((chat) => chat.chatId === selectedChatId);

    const handleError = useCallback((error) => {
        const err = getApiError(error);
        if (err.status === 401) {
            localStorage.removeItem("my_app_token");
            navigate("/login");
            return;
        }
        setErrorText(err.message);
    }, [navigate]);

    const loadChatList = useCallback(async () => {
        const list = await api.call(ENDPOINTS.CHAT.LIST_CHATS);
        setChats(Array.isArray(list) ? list : []);
    }, []);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            setErrorText("");
            try {
                const me = await api.call(ENDPOINTS.ME.GET_PROFILE);
                setMyUserId(me.userId);
                await loadChatList();
            } catch (error) {
                handleError(error);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [handleError, loadChatList, searchParams]);

    useEffect(() => {
        clientRef.current = createChatClient({
            onConnected: () => setIsConnected(true),
            onError: (text) => { setIsConnected(false); setErrorText(text); },
        });
        return () => closeChatClient(clientRef.current);
    }, []);

    useEffect(() => {
        if (!isConnected) return;
        const subscription = subscribeToChatErrors(clientRef.current, (text) => setErrorText(text));
        return () => subscription.unsubscribe();
    }, [isConnected]);

    useEffect(() => {
        if (!selectedChatId) return;
        const loadMessages = async () => {
            try {
                const list = await api.call(ENDPOINTS.CHAT.LIST_MESSAGES(selectedChatId));
                setMessages(Array.isArray(list) ? list : []);
                await api.call(ENDPOINTS.CHAT.MARK_READ(selectedChatId));
                setChats((prev) => prev.map((chat) => chat.chatId === selectedChatId ? { ...chat, unreadCount: 0 } : chat));
            } catch (error) {
                handleError(error);
            }
        };
        loadMessages();
    }, [selectedChatId, handleError]);

    useEffect(() => {
        if (!isConnected || !selectedChatId) return;
        const subscription = subscribeToChat(clientRef.current, selectedChatId, async (newMessage) => {
            setMessages((prev) => prev.some((m) => m.messageId === newMessage.messageId) ? prev : [...prev, newMessage]);
            setChats((prev) => prev.map((c) => c.chatId === newMessage.chatId ? {
                ...c,
                lastMessage: newMessage.content,
                updatedAt: newMessage.sentAt,
                unreadCount: newMessage.senderId === myUserId ? (c.unreadCount ?? 0) : 0,
            } : c));

            if (newMessage.senderId !== myUserId) {
                try {
                    await api.call(ENDPOINTS.CHAT.MARK_READ(newMessage.chatId));
                } catch {
                    // The periodic/chat selection reload will reconcile the read state if this fails.
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [isConnected, selectedChatId, myUserId]);

    const handleSelectChat = (chatId) => {
        setPickedChatId(chatId);
        setMessages([]);
        setShowProfile(false);
        setErrorText("");
    };

    return (
        <div className="h-screen flex bg-gray-50">
            <div className="w-72 bg-white border-r border-gray-100 overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-800">Chats</h1>
                    <NotificationBell onNewNotification={loadChatList} />
                </div>

                <div className="px-4"><MessageBox type="error" text={errorText} /></div>
                {isLoading && <p className="px-4 text-sm text-gray-500">Loading...</p>}
                {!isLoading && chats.length === 0 && !errorText && <p className="px-4 text-sm text-gray-500">No chats yet.</p>}

                {chats.map((chat) => (
                    <button key={chat.chatId} onClick={() => handleSelectChat(chat.chatId)} className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 ${chat.chatId === selectedChatId ? "bg-green-50" : ""}`}>
                        <div className="w-10 h-10 shrink-0 rounded-full bg-green-100 text-green-700 font-semibold flex items-center justify-center">{(chat.otherUserName ?? "?").charAt(0).toUpperCase()}</div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2"><p className="text-sm font-medium text-gray-800 truncate">{chat.otherUserName ?? "Unknown user"}</p>{chat.unreadCount > 0 && <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-green-600 text-white text-[10px] font-bold flex items-center justify-center">{chat.unreadCount}</span>}</div>
                            <p className="text-xs text-gray-500 truncate">{chat.lastMessage ?? "No messages yet"}</p>
                        </div>
                    </button>
                ))}
            </div>

            {selectedChat ? (
                <ChatWindow chat={selectedChat} messages={messages} myUserId={myUserId} canSend={isConnected} onSend={(text) => { setErrorText(""); sendChatMessage(clientRef.current, selectedChat.chatId, text); }} onOpenProfile={() => setShowProfile(true)} />
            ) : (
                <div className="flex-1 flex items-center justify-center"><p className="text-sm text-gray-500">Select a chat to start.</p></div>
            )}

            {showProfile && selectedChat && (
                <div className="w-72 bg-white border-l border-gray-100 p-6 text-center">
                    <div className="flex justify-between mb-6 text-sm text-gray-500"><button onClick={() => setShowProfile(false)}>✕</button><span>Contact info</span></div>
                    <div className="w-24 h-24 mx-auto rounded-full bg-green-100 text-green-700 text-3xl font-semibold flex items-center justify-center">{(selectedChat.otherUserName ?? "?").charAt(0).toUpperCase()}</div>
                    <h3 className="mt-3 text-lg font-semibold text-gray-800">{selectedChat.otherUserName}</h3>
                </div>
            )}
        </div>
    );
}

export default ChatPage;
