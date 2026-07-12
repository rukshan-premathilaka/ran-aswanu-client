/**
 * endpoints.js
 * ------------------------------------------------------
 * WHAT: A single object listing every backend endpoint — its URL and
 *       HTTP method — organized by feature (matches your Postman
 *       collection's folder structure: Auth / Me / Other Users).
 *
 * WHY:  This is the ONE file to check or edit when the backend team adds,
 *       removes, or changes an endpoint. No need to hunt through
 *       components or service files.
 *
 * HOW TO ADD A NEW ENDPOINT:
 *   1. Find (or create) the relevant group below (e.g. AUTH, ME, USERS).
 *   2. Add a new key with { url, method }.
 *   3. If the URL needs a dynamic value (like a userId), make it a
 *      function that returns { url, method } — see USERS.GET_RATINGS below.
 *
 * Example — adding "DELETE /me" (delete my account):
 *   ME: {
 *     ...
 *     DELETE_ACCOUNT: { url: "/me", method: "DELETE" },
 *   }
 */

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
        // Dynamic endpoint: userId isn't known until called, so this is a
        // function instead of a plain object. Call it like:
        // ENDPOINTS.USERS.GET_RATINGS(5) -> { url: "/users/5/ratings", method: "GET" }
        GET_RATINGS: (userId) => ({ url: `/users/${userId}/ratings`, method: "GET" }),
    },
};

export default ENDPOINTS;