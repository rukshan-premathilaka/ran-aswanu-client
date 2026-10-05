// src/api/apiError.js
// Turns any axios error into: { status, message, fieldErrors }
const DEFAULT_MESSAGES = {
    401: "Please log in again.",
    403: "You do not have permission to do this.",
    404: "We could not find what you asked for.",
    409: "This already exists.",
    413: "The file is too big. The maximum size is 5 MB.",
};

export function getApiError(error) {
    if (!error?.response) {
        return { status: 0, message: "Cannot reach the server. Check your internet and try again.", fieldErrors: {} };
    }
    const status = error.response.status;
    const data = error.response.data;

    // Shape A (validation): { "pickupLocation": "Pickup location is required", ... }
    const isFieldMap = status === 400 && data && typeof data === "object" && typeof data.error !== "string";
    if (isFieldMap) return { status, message: "Please fix the highlighted fields.", fieldErrors: data };

    // Shape B (everything else): { timestamp, status, error: "Readable message" }
    if (typeof data?.error === "string" && data.error.trim() !== "") {
        return { status, message: data.error, fieldErrors: {} };
    }
    const fallback = status >= 500
        ? "Something went wrong on our side. Please try again later."
        : DEFAULT_MESSAGES[status] || `Request failed (${status}). Please try again.`;
    return { status, message: fallback, fieldErrors: {} };
}