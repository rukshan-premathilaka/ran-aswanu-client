/**
 * authService.js
 * ------------------------------------------------------
 * WHAT: One exported function per Auth-related backend action
 *       (register, login, forgot password, reset password).
 *
 * WHY:  Components should call plain functions like loginUser(data)
 *       instead of knowing HTTP methods, URLs, or axios syntax.
 *       This keeps components focused on UI, not networking.
 *
 * HOW TO ADD A NEW AUTH REQUEST:
 *   1. Add the endpoint to endpoints.js under AUTH (see that file's comments).
 *   2. Add a new exported function here following the same pattern:
 *
 *      export const myNewAction = (payload) => {
 *          const { url, method } = ENDPOINTS.AUTH.MY_NEW_ACTION;
 *          return axiosInstance.request({ url, method, data: payload });
 *      };
 *
 *   3. Import and call it from your component:
 *      import { myNewAction } from "@/api/authService.js";
 */

import axiosInstance from "./axiosInstance.js";
import ENDPOINTS from "./endpoints.js";

// payload example: { username, email, password }
export const registerUser = (payload) => {
    const { url, method } = ENDPOINTS.AUTH.REGISTER;
    return axiosInstance.request({ url, method, data: payload });
};

// payload example: { email, password }
export const loginUser = (payload) => {
    const { url, method } = ENDPOINTS.AUTH.LOGIN;
    return axiosInstance.request({ url, method, data: payload });
};

// payload example: { email }
export const forgotPassword = (payload) => {
    const { url, method } = ENDPOINTS.AUTH.FORGOT_PASSWORD;
    return axiosInstance.request({ url, method, data: payload });
};

// payload example: { token, newPassword }
export const resetPassword = (payload) => {
    const { url, method } = ENDPOINTS.AUTH.RESET_PASSWORD;
    return axiosInstance.request({ url, method, data: payload });
};