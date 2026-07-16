import { useState } from "react";
import "../chatbox.css";
import NotificationBell from "./NotificationBell.jsx";

// Sample contact data - passe backend eken enna one
const chats = [
    {
        id: 1,
        name: "Rukshan (Ruka)",
        phone: "+94 78 811 6854",
        about: "Rasintha rukshan",
        avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
        id: 2,
        name: "Isuru",
        phone: "+94 71 234 5678",
        about: "Hey there! I am using WhatsApp",
        avatar: "https://i.pravatar.cc/150?img=15",
    },
    {
        id: 3,
        name: "Samitha",
        phone: "+94 77 987 6543",
        about: "Busy",
        avatar: "https://i.pravatar.cc/150?img=20",
    },
];

// Sample messages, keyed by chat id - "them" = sender ewapu eka, "me" = api send karapu eka
const initialMessages = {
    1: [
        { id: 1, sender: "them", text: "Api Friday deliver karamuda?" },
        { id: 2, sender: "me", text: "Ow, hondai. Time eka confirm karannam." },
    ],
    2: [{ id: 1, sender: "them", text: "Order eka ready da?" }],
    3: [],
};

// Sample notifications data - NotificationBell ekata data widihata pass karanawa
const notifications = [
    { id: 1, title: "Info...", description: "Use for inform something to user about system" },
    { id: 2, title: "Info...", description: "Use for inform something to user about system" },
    { id: 3, title: "Info...", description: "Use for inform something to user about system" },
    { id: 4, title: "Info...", description: "Use for inform something to user about system" }
];

function ChatPage() {
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [messagesByChat, setMessagesByChat] = useState(initialMessages);
    const [messageInput, setMessageInput] = useState("");

    const selectedChat = chats.find((chat) => chat.id === selectedChatId);
    const messages = selectedChatId ? messagesByChat[selectedChatId] || [] : [];

    // Contact list eken chat ekක select kalama
    const handleSelectChat = (chat) => {
        setSelectedChatId(chat.id);
        setShowProfile(false); // chat wenas kalama profile panel eka close wenawa
    };

    // Message send button ho Enter danapu welawe
    const handleSend = () => {
        if (messageInput.trim() === "" || !selectedChatId) return;

        const newMessage = {
            id: Date.now(),
            sender: "me",
            text: messageInput,
        };

        setMessagesByChat((prev) => ({
            ...prev,
            [selectedChatId]: [...(prev[selectedChatId] || []), newMessage],
        }));

        setMessageInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <div className="chat-container">
            {/* Left side - contact names + profile pictures */}
            <div className="sidebar">
                <div
                    className="sidebar-header"
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                    <span>Chats</span>
                    <NotificationBell notifications={notifications} />
                </div>

                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        className={`contact-item ${chat.id === selectedChatId ? "active" : ""}`}
                        onClick={() => handleSelectChat(chat)}
                    >
                        <img src={chat.avatar} alt={chat.name} className="avatar" />
                        <span className="contact-name">{chat.name}</span>
                    </div>
                ))}
            </div>

            {/* Right side - selected sender's inbox */}
            {selectedChat ? (
                <div className="chat-window">
                    {/* Top - sender name + photo, click kalama profile eka open wenawa */}
                    <div className="chat-header" onClick={() => setShowProfile(true)}>
                        <img src={selectedChat.avatar} alt={selectedChat.name} className="avatar" />
                        <span className="chat-header-name">{selectedChat.name}</span>
                    </div>

                    {/* Middle - received (left) and sent (right) messages */}
                    <div className="messages-area">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`message-row ${msg.sender === "me" ? "sent" : "received"}`}
                            >
                                <div className={`message-bubble ${msg.sender === "me" ? "sent" : "received"}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom - message input box */}
                    <div className="message-input-bar">
                        <input
                            type="text"
                            className="message-input"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message"
                        />
                        <button className="send-button" onClick={handleSend}>
                            ➤
                        </button>
                    </div>
                </div>
            ) : (
                <div className="chat-window empty-state">
                    <p>Chat ekක select karanna</p>
                </div>
            )}

            {/* Profile panel - top header click kalama pennanawa */}
            {showProfile && selectedChat && (
                <div className="profile-panel">
                    <div className="profile-header">
                        <span onClick={() => setShowProfile(false)}>✕</span>
                        <span>Contact info</span>
                    </div>

                    <img src={selectedChat.avatar} alt={selectedChat.name} className="profile-avatar" />
                    <h3 className="profile-name">{selectedChat.name}</h3>
                    <p className="profile-phone">{selectedChat.phone}</p>

                    <div className="profile-about">
                        <p className="profile-label">About</p>
                        <p>{selectedChat.about}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatPage;