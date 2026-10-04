import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";

export const registerUser = (userData) => api.call(ENDPOINTS.AUTH.REGISTER, userData);

export const loginUser = (credentials) => api.call(ENDPOINTS.AUTH.LOGIN, credentials);
