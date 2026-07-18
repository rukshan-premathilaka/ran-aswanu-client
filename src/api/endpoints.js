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

    USERS: {
        GET_RATINGS: (userId) => ({ url: `/users/${userId}/ratings`, method: "GET" }),
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
        // Public browse — no auth required
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
};

export default ENDPOINTS;