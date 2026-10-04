const ENDPOINTS = {
    AUTH: {
        REGISTER: { url: "/auth/register", method: "POST" },
        LOGIN: { url: "/auth/login", method: "POST" },
        FORGOT_PASSWORD: { url: "/auth/forgot-password", method: "POST" },
        RESET_PASSWORD: { url: "/auth/reset-password", method: "POST" },
    },

    ME: {
        GET_PROFILE: { url: "/me", method: "GET" },
        UPDATE_PROFILE: { url: "/me", method: "PUT" },
        UPDATE_ROLE: { url: "/me/role", method: "PUT" },
        UPLOAD_PICTURE: { url: "/me/picture", method: "POST" },
    },

    FARMER_DASHBOARD: {
        GET_SUMMARY: { url: "/farmer/dashboard/summary", method: "GET" },
        GET_RECENT_ORDERS: { url: "/farmer/orders/recent", method: "GET" },
        GET_RECENT_ACTIVITY: { url: "/farmer/activities/recent", method: "GET" },
        LIST_TASKS: { url: "/farmer/tasks", method: "GET" },
        CREATE_TASK: { url: "/farmer/tasks", method: "POST" },
        TOGGLE_TASK: (taskId) => ({ url: `/farmer/tasks/${taskId}/toggle`, method: "PATCH" }),
        DELETE_TASK: (taskId) => ({ url: `/farmer/tasks/${taskId}`, method: "DELETE" }),
    },

    FARMER_PRODUCTS: {
        CREATE: { url: "/farmer/products", method: "POST" },
        LIST_MINE: { url: "/farmer/products", method: "GET" },
        UPDATE: (productId) => ({ url: `/farmer/products/${productId}`, method: "PUT" }),
        UPDATE_STATUS: (productId) => ({ url: `/farmer/products/${productId}/status`, method: "PATCH" }),
        DELETE: (productId) => ({ url: `/farmer/products/${productId}`, method: "DELETE" }),
        UPLOAD_IMAGE: (productId) => ({ url: `/farmer/products/${productId}/image`, method: "POST" }),
    },

    PRODUCTS: {
        LIST_ALL: { url: "/products", method: "GET" },
        GET_BY_ID: (productId) => ({ url: `/products/${productId}`, method: "GET" }),
    },

    FARMER_CROPS: {
        LIST: { url: "/farmer/crops", method: "GET" },
        CREATE: { url: "/farmer/crops", method: "POST" },
        GET_BY_ID: (cropId) => ({ url: `/farmer/crops/${cropId}`, method: "GET" }),
        UPDATE: (cropId) => ({ url: `/farmer/crops/${cropId}`, method: "PUT" }),
        DELETE: (cropId) => ({ url: `/farmer/crops/${cropId}`, method: "DELETE" }),
    },

    FARMER_CALENDAR: {
        GET_MONTH: (year, month) => ({ url: `/farmer/calendar?year=${year}&month=${month}`, method: "GET" }),
        GET_DATE: (date) => ({ url: `/farmer/calendar/${date}`, method: "GET" }),
        SAVE_DATE: (date) => ({ url: `/farmer/calendar/${date}`, method: "PUT" }),
        DELETE_DATE: (date) => ({ url: `/farmer/calendar/${date}`, method: "DELETE" }),
    },

    SUPPORT: {
        SEND_MESSAGE: { url: "/support/messages", method: "POST" },
        LIST_MY_MESSAGES: { url: "/support/messages", method: "GET" },
    },

    // The backend keeps /buyer/orders for compatibility; BUYER/FARMER/TRANSPORT may now use it.
    BUYER_ORDERS: {
        PLACE_ORDER: { url: "/buyer/orders", method: "POST" },
        LIST_MINE: { url: "/buyer/orders", method: "GET" },
    },

    RATINGS: {
        SUBMIT: (orderId) => ({ url: `/orders/${orderId}/rating`, method: "POST" }),
        LIST_FOR_USER: (userId) => ({ url: `/users/${userId}/reviews`, method: "GET" }),
    },

    DELIVERY: {
        CREATE_REQUEST: { url: "/delivery-requests", method: "POST" },
        LIST_MY_REQUESTS: { url: "/delivery-requests", method: "GET" },
        GET_MATCHES: (requestId) => ({ url: `/delivery-requests/${requestId}/matches`, method: "GET" }),
        JOIN: (requestId) => ({ url: `/delivery-requests/${requestId}/join`, method: "POST" }),
        GET_TRACKING: (deliveryId) => ({ url: `/deliveries/${deliveryId}/status`, method: "GET" }),
        UPDATE_STATUS: (deliveryId) => ({ url: `/deliveries/${deliveryId}/status`, method: "PATCH" }),

        // New customer/transport flow. Legacy names remain as aliases below.
        LIST_CUSTOMER_REQUESTS: { url: "/delivery-requests/open?type=CUSTOMER_REQUEST", method: "GET" },
        LIST_FARMER_REQUESTS: { url: "/delivery-requests/open?type=FARMER_REQUEST", method: "GET" },
        SELECT: (requestId) => ({ url: `/delivery-requests/${requestId}/accept`, method: "POST" }),
        ACCEPT_REQUEST: (requestId) => ({ url: `/delivery-requests/${requestId}/accept`, method: "POST" }),

        LIST_VEHICLES: { url: "/delivery/vehicles", method: "GET" },
        CREATE_VEHICLE: { url: "/delivery/vehicles", method: "POST" },
        UPDATE_VEHICLE: (vehicleId) => ({ url: `/delivery/vehicles/${vehicleId}`, method: "PUT" }),
        DELETE_VEHICLE: (vehicleId) => ({ url: `/delivery/vehicles/${vehicleId}`, method: "DELETE" }),

        // Legacy endpoint kept for older UI/API clients.
        LIST_LEGACY_VEHICLE_OFFERS: { url: "/delivery-requests/open?type=VEHICLE_OFFER", method: "GET" },
    },

    NOTIFICATIONS: {
        LIST_MINE: { url: "/notifications", method: "GET" },
        MARK_READ: (id) => ({ url: `/notifications/${id}/read`, method: "PATCH" }),
    },

    CHAT: {
        START: { url: "/chats", method: "POST" },
        LIST_CHATS: { url: "/chats", method: "GET" },
        LIST_MESSAGES: (chatId) => ({ url: `/chats/${chatId}/messages`, method: "GET" }),
        MARK_READ: (chatId) => ({ url: `/chats/${chatId}/read`, method: "PATCH" }),
    },
};

export default ENDPOINTS;
