/**
 * userService.js
 * ------------------------------------------------------
 * WHAT: One exported function per "Me" (self-service) and "Other Users"
 *       backend action.
 *
 * WHY / HOW TO ADD: same pattern as authService.js — add the endpoint to
 *       endpoints.js first, then wrap it in a function here.
 */

import axiosInstance from "./axiosInstance.js";
import ENDPOINTS from "./endpoints.js";

// No payload needed — token identifies the user via the interceptor.
export const getMyProfile = () => {
    const { url, method } = ENDPOINTS.ME.GET_PROFILE;
    return axiosInstance.request({ url, method });
};

// payload example: { username, email, phoneNumber, address }
export const updateMyProfile = (payload) => {
    const { url, method } = ENDPOINTS.ME.UPDATE_PROFILE;
    return axiosInstance.request({ url, method, data: payload });
};

// payload example: { role: "FARMER" }
export const updateMyRole = (payload) => {
    const { url, method } = ENDPOINTS.ME.UPDATE_ROLE;
    return axiosInstance.request({ url, method, data: payload });
};

// file: a File object from an <input type="file"> element.
// This one needs FormData + a different Content-Type, so it's built
// manually instead of just passing a plain object.
export const uploadMyPicture = (file) => {
    const { url, method } = ENDPOINTS.ME.UPLOAD_PICTURE;
    const formData = new FormData();
    formData.append("file", file);
    return axiosInstance.request({
        url,
        method,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// userId: the id of the user whose ratings you want to view.
export const getUserRatings = (userId) => {
    const { url, method } = ENDPOINTS.USERS.GET_RATINGS(userId);
    return axiosInstance.request({ url, method });
};