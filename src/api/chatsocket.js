// ALL WebSocket code for chat lives here. Pages must not create sockets.
// Needs:  npm install @stomp/stompjs sockjs-client
// (moved from src/page/common/Chatsocket.js -> src/api/chatSocket.js, small "s")
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SOCKET_URL = "http://localhost:8080/ws/chat";

// Opens the connection. The backend knows who we are from the token.
export function createChatClient({ onConnected, onError }) {
    const token = localStorage.getItem("my_app_token");

    const client = new Client({
        webSocketFactory: () => new SockJS(SOCKET_URL),
        connectHeaders: { Authorization: "Bearer " + token },
        reconnectDelay: 5000,
        onConnect: () => onConnected(),
        onStompError: () => onError("Chat connection failed. Please try again."),
        onWebSocketError: () => onError("Cannot reach the chat server."),
    });

    client.activate();
    return client;
}

// Listen for new messages in one chat. Returns the subscription (call .unsubscribe() to stop).
export function subscribeToChat(client, chatId, onMessage) {
    return client.subscribe("/topic/chat/" + chatId, (frame) => {
        onMessage(JSON.parse(frame.body));
    });
}

// Server-side errors for MY messages, e.g. { "error": "Message must be at most 1000 characters" }.
export function subscribeToChatErrors(client, onErrorText) {
    return client.subscribe("/user/queue/errors", (frame) => {
        try {
            onErrorText(JSON.parse(frame.body).error ?? "Message could not be sent.");
        } catch {
            onErrorText("Message could not be sent.");
        }
    });
}

// Live notifications. The backend only allows subscribing to YOUR OWN user id.
// Each frame is one notification object (same keys as GET /notifications).
export function subscribeToNotifications(client, myUserId, onNotification) {
    return client.subscribe("/topic/notifications/" + myUserId, (frame) => {
        onNotification(JSON.parse(frame.body));
    });
}

// Do not send senderId, the backend reads it from the token.
export function sendChatMessage(client, chatId, content) {
    client.publish({
        destination: "/app/chat/" + chatId,
        body: JSON.stringify({ content }),
    });
}

export function closeChatClient(client) {
    if (client) client.deactivate();
}