import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { getApiError } from "@/api/Apierror.js";
import {
    createChatClient,
    subscribeToChat,
    subscribeToChatErrors,
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

    const [myUserId, setMyUserId] = useState(null);
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorText, setErrorText] = useState("");

    // /chat?chatId=12 (from "Chat with seller") selects that chat; a click in the list overrides it
    const chatIdFromUrl = Number(searchParams.get("chatId")) || null;
    const [pickedChatId, setPickedChatId] = useState(null);
    const selectedChatId = pickedChatId ?? chatIdFromUrl;
    const [messages, setMessages] = useState([]);
    const [showProfile, setShowProfile] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const selectedChat = chats.find((chat) => chat.chatId === selectedChatId);

    // A 401 on a protected page means the login expired
    const handleError = (error) => {
        const err = getApiError(error);
        if (err.status === 401) {
            localStorage.removeItem("my_app_token");
            navigate("/login");
            return;
        }
        setErrorText(err.message);
    };

    // 1. Load who I am (to know which messages are mine) and my chat list
    useEffect(() => {
        const loadChats = async () => {
            setIsLoading(true);
            setErrorText("");
            try {
                const me = await api.call(ENDPOINTS.ME.GET_PROFILE);
                setMyUserId(me.userId);
                const list = await api.call(ENDPOINTS.CHAT.LIST_CHATS);
                setChats(Array.isArray(list) ? list : []);
            } catch (error) {
                handleError(error);
            } finally {
                setIsLoading(false);
            }
        };
        loadChats();
        // Reload when we arrive from "Chat with seller" (a brand new chat is not in an old list)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // 2. One socket connection for the whole page
    useEffect(() => {
        clientRef.current = createChatClient({
            onConnected: () => setIsConnected(true),
            onError: (text) => {
                setIsConnected(false);
                setErrorText(text);
            },
        });
        return () => closeChatClient(clientRef.current);
    }, []);

    // 2b. Errors the server sends back for my messages (for example "too long")
    useEffect(() => {
        if (!isConnected) return;
        const subscription = subscribeToChatErrors(clientRef.current, (text) => setErrorText(text));
        return () => subscription.unsubscribe();
    }, [isConnected]);

    // 3. Load history when a chat is selected
    useEffect(() => {
        if (!selectedChatId) return;
        const loadMessages = async () => {
            try {
                const list = await api.call(ENDPOINTS.CHAT.LIST_MESSAGES(selectedChatId));
                setMessages(Array.isArray(list) ? list : []);
            } catch (error) {
                handleError(error);
            }
        };
        loadMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChatId]);

    // 4. Listen for new messages in the selected chat
    useEffect(() => {
        if (!isConnected || !selectedChatId) return;
        const subscription = subscribeToChat(clientRef.current, selectedChatId, (newMessage) => {
            // The sender also gets their own message back here, so a message only shows after the server accepted it
            setMessages((prev) =>
                prev.some((m) => m.messageId === newMessage.messageId) ? prev : [...prev, newMessage]
            );
            // Keep the left list in sync (last message text)
            setChats((prev) =>
                prev.map((c) => (c.chatId === newMessage.chatId ? { ...c, lastMessage: newMessage.content } : c))
            );
        });
        return () => subscription.unsubscribe();
    }, [isConnected, selectedChatId]);

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
                    <NotificationBell />
                </div>

                <div className="px-4">
                    <MessageBox type="error" text={errorText} />
                </div>
                {isLoading && <p className="px-4 text-sm text-gray-500">Loading...</p>}
                {!isLoading && chats.length === 0 && !errorText && (
                    <p className="px-4 text-sm text-gray-500">No chats yet.</p>
                )}

                {chats.map((chat) => (
                    <button
                        key={chat.chatId}
                        onClick={() => handleSelectChat(chat.chatId)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 ${
                            chat.chatId === selectedChatId ? "bg-green-50" : ""
                        }`}
                    >
                        <div className="w-10 h-10 shrink-0 rounded-full bg-green-100 text-green-700 font-semibold flex items-center justify-center">
                            {(chat.otherUserName ?? "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800">{chat.otherUserName ?? "Unknown user"}</p>
                            <p className="text-xs text-gray-500 truncate">{chat.lastMessage ?? "No messages yet"}</p>
                        </div>
                    </button>
                ))}
            </div>

            {selectedChat ? (
                <ChatWindow
                    chat={selectedChat}
                    messages={messages}
                    myUserId={myUserId}
                    canSend={isConnected}
                    onSend={(text) => {
                        setErrorText("");
                        sendChatMessage(clientRef.current, selectedChat.chatId, text);
                    }}
                    onOpenProfile={() => setShowProfile(true)}
                />
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-sm text-gray-500">Select a chat to start.</p>
                </div>
            )}

            {showProfile && selectedChat && (
                <div className="w-72 bg-white border-l border-gray-100 p-6 text-center">
                    <div className="flex justify-between mb-6 text-sm text-gray-500">
                        <button onClick={() => setShowProfile(false)}>✕</button>
                        <span>Contact info</span>
                    </div>
                    <div className="w-24 h-24 mx-auto rounded-full bg-green-100 text-green-700 text-3xl font-semibold flex items-center justify-center">
                        {(selectedChat.otherUserName ?? "?").charAt(0).toUpperCase()}
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-gray-800">{selectedChat.otherUserName}</h3>
                    {/* The backend sends no phone or "about" for another user, so only the name is shown. */}
                </div>
            )}
        </div>
    );
}

export default ChatPage;