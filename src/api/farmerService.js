import apiService from './ApiService.js';
import ENDPOINTS from './endpoints.js';

export const farmerService = {
    // ----------------- Profile / Settings -----------------
    getProfile: () => apiService.get(ENDPOINTS.ME.GET_PROFILE.url),
    updateProfile: (data) => apiService.put(ENDPOINTS.ME.UPDATE_PROFILE.url, data),

    // ----------------- Products / Harvest -----------------
    createProduct: (data) => apiService.post(ENDPOINTS.FARMER_PRODUCTS.CREATE.url, data),
    getProducts: () => apiService.get(ENDPOINTS.FARMER_PRODUCTS.LIST_MINE.url),
    updateProduct: (id, data) => apiService.put(ENDPOINTS.FARMER_PRODUCTS.UPDATE(id).url, data),
    deleteProduct: (id) => apiService.delete(ENDPOINTS.FARMER_PRODUCTS.DELETE(id).url),
    uploadProductImage: (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return apiService.post(ENDPOINTS.FARMER_PRODUCTS.UPLOAD_IMAGE(id).url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // ----------------- Crops -----------------
    getCrops: () => apiService.get(ENDPOINTS.FARMER_CROPS.LIST.url),
    createCrop: (data) => apiService.post(ENDPOINTS.FARMER_CROPS.CREATE.url, data),
    updateCrop: (id, data) => apiService.put(ENDPOINTS.FARMER_CROPS.UPDATE(id).url, data),
    deleteCrop: (id) => apiService.delete(ENDPOINTS.FARMER_CROPS.DELETE(id).url),

    // ----------------- Calendar -----------------
    getCalendarDate: (date) => apiService.get(ENDPOINTS.FARMER_CALENDAR.GET_DATE(date).url),
    saveCalendarDate: (date, data) => apiService.put(ENDPOINTS.FARMER_CALENDAR.SAVE_DATE(date).url, data),
    deleteCalendarDate: (date) => apiService.delete(ENDPOINTS.FARMER_CALENDAR.DELETE_DATE(date).url),

    // ----------------- Dashboard & Orders -----------------
    getSummary: () => apiService.get(ENDPOINTS.FARMER_DASHBOARD.GET_SUMMARY.url),
    getTasks: () => apiService.get(ENDPOINTS.FARMER_DASHBOARD.LIST_TASKS.url),
    createTask: (data) => apiService.post(ENDPOINTS.FARMER_DASHBOARD.CREATE_TASK.url, data),
    toggleTask: (id) => apiService.patch(ENDPOINTS.FARMER_DASHBOARD.TOGGLE_TASK(id).url),
    deleteTask: (id) => apiService.delete(ENDPOINTS.FARMER_DASHBOARD.DELETE_TASK(id).url),
    getRecentOrders: () => apiService.get(ENDPOINTS.FARMER_ORDERS.GET_RECENT.url),

    // ----------------- Support & Help -----------------
    sendSupportMessage: (data) => apiService.post(ENDPOINTS.SUPPORT.SEND_MESSAGE.url, data),
    trackFaqClick: (data) => apiService.post(ENDPOINTS.SUPPORT.TRACK_FAQ.url, data),
};