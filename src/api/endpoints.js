
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
};

export default ENDPOINTS;