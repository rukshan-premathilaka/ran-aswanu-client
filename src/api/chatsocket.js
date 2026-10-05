import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { WS_URL as SOCKET_URL } from "@/api/config.js";

function parseServerError(frame) {
    const body = frame?.body ?? "";
    try {
        const parsed = JSON.parse(body);
        if (typeof parsed?.error === "string" && parsed.error.trim()) return parsed.error.trim();
        if (typeof parsed?.message === "string" && parsed.message.trim()) return parsed.message.trim();
    } catch {
        // STOMP error bodies are not required to be JSON.
    }
    if (typeof frame?.headers?.message === "string" && frame.headers.message.trim()) {
        return frame.headers.message.trim();
    }
    return "The chat server rejected this request. Please try again.";
}

export function createChatClient({ onConnected, onError, onDisconnect } = {}) {
    const token = localStorage.getItem("my_app_token");
    let hadStompError = false;

    const client = new Client({
        webSocketFactory: () => new SockJS(SOCKET_URL),
        connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
        reconnectDelay: 3000,
        connectionTimeout: 10000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        onConnect: () => {
            hadStompError = false;
            onConnected?.(client);
        },
        onStompError: (frame) => {
            hadStompError = true;
            const text = parseServerError(frame);
            // A rejected login will never succeed by retrying; stop the endless reconnect loop.
            const isAuthError = /log in again/i.test(text);
            if (isAuthError) void client.deactivate();
            onError?.(text, { type: "stomp", frame, isAuthError });
        },
        onWebSocketError: (event) => {
            if (hadStompError) return;
            onError?.("Cannot reach the chat server. Please check that the backend is running.", {
                type: "websocket",
                event,
            });
        },
        onWebSocketClose: () => {
            onDisconnect?.();
        },
        onDisconnect: () => {
            onDisconnect?.();
        },
        debug: () => {
            // Keep STOMP protocol noise out of the browser console in production.
        },
    });

    if (!token) {
        onError?.("Please log in again to use chat.", { type: "auth" });
        return client;
    }

    client.activate();
    return client;
}

export function subscribeToChat(client, chatId, onMessage, onError) {
    if (!client?.connected || !chatId) return null;

    try {
        return client.subscribe(`/topic/chat/${chatId}`, (frame) => {
            try {
                onMessage?.(JSON.parse(frame.body));
            } catch {
                onError?.("Received an invalid chat message from the server.");
            }
        });
    } catch (error) {
        onError?.(error instanceof Error ? error.message : "Could not subscribe to this chat.");
        return null;
    }
}

export function subscribeToChatErrors(client, onErrorText, onError) {
    if (!client?.connected) return null;
    try {
        return client.subscribe("/user/queue/errors", (frame) => {
            try {
                onErrorText?.(JSON.parse(frame.body).error ?? "Message could not be sent.");
            } catch {
                onErrorText?.("Message could not be sent.");
            }
        });
    } catch (error) {
        onError?.(error instanceof Error ? error.message : "Could not subscribe to chat errors.");
        return null;
    }
}

export function subscribeToNotifications(client, myUserId, onNotification, onError) {
    if (!client?.connected || !myUserId) return null;
    try {
        return client.subscribe(`/topic/notifications/${myUserId}`, (frame) => {
            try {
                onNotification?.(JSON.parse(frame.body));
            } catch {
                onError?.("Received an invalid notification from the server.");
            }
        });
    } catch (error) {
        onError?.(error instanceof Error ? error.message : "Could not subscribe to notifications.");
        return null;
    }
}

export function sendChatMessage(client, chatId, content) {
    if (!client?.connected) {
        throw new Error("Chat is not connected yet.");
    }

    client.publish({
        destination: `/app/chat/${chatId}`,
        body: JSON.stringify({ content }),
    });
}

export function closeChatClient(client) {
    if (client) {
        void client.deactivate();
    }
}
