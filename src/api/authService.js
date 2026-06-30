import axiosInstance from "./axiosInstance.js";

export const registerUser = async (userData) => {
	const response = await axiosInstance.post("/users/register", userData);
	return response.data;
};

export const loginUser = async (credentials) => {
	const response = await axiosInstance.post("/users/login", credentials);
	return response.data;
};