import axiosInstance from "./axiosInstance.js";
import ENDPOINTS from "./endpoints.js";

export const getMyProfile = () => {
    const { url, method } = ENDPOINTS.ME.GET_PROFILE;
    return axiosInstance.request({ url, method });
};

export const updateMyProfile = (payload) => {
    const { url, method } = ENDPOINTS.ME.UPDATE_PROFILE;
    return axiosInstance.request({ url, method, data: payload });
};

export const updateMyRole = (payload) => {
    const { url, method } = ENDPOINTS.ME.UPDATE_ROLE;
    return axiosInstance.request({ url, method, data: payload });
};

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

export const getUserRatings = (userId) => {
    const { url, method } = ENDPOINTS.USERS.GET_RATINGS(userId);
    return axiosInstance.request({ url, method });
};