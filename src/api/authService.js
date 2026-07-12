import axiosInstance from "./axiosInstance.js";
import ENDPOINTS from "./endpoints.js";

export const registerUser = (payload) => {
    const { url, method } = ENDPOINTS.AUTH.REGISTER;
    return axiosInstance.request({ url, method, data: payload });
};

export const loginUser = (payload) => {
    const { url, method } = ENDPOINTS.AUTH.LOGIN;
    return axiosInstance.request({ url, method, data: payload });
};

export const forgotPassword = (payload) => {
    const { url, method } = ENDPOINTS.AUTH.FORGOT_PASSWORD;
    return axiosInstance.request({ url, method, data: payload });
};

export const resetPassword = (payload) => {
    const { url, method } = ENDPOINTS.AUTH.RESET_PASSWORD;
    return axiosInstance.request({ url, method, data: payload });
};