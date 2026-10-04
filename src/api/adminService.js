import ApiService from '@/api/ApiService.js';
import { FILES_BASE_URL } from '@/api/config.js';

// Same ApiService the farmer / buyer pages use (base URL + Bearer token are handled inside it).
const api = new ApiService();

// Backend root without "/api" -> used to build image links like  baseUrl + "/files/profile-pics/abc.png"
export { FILES_BASE_URL };

export const fileUrl = (path) => (path ? `${FILES_BASE_URL}${path}` : null);

// Guide rule: "do not send empty values (leave the key out)"
export const cleanParams = (params = {}) =>
    Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
    );

// All admin calls live here so the pages never write URLs by hand.
// Only the 13 endpoints from the guide (section 5) are used. No POST / PUT / DELETE in the admin area.
const adminService = {
    // 2. who am I (role check)
    getMe: () => api.request('GET', '/me'),

    // 3-5. statistics
    getSummary: () => api.request('GET', '/admin/stats/summary'),
    getMonthlyStats: (year) => api.request('GET', '/admin/stats/monthly', cleanParams({ year })),
    getYearlyStats: () => api.request('GET', '/admin/stats/yearly'),

    // 6-8. users
    listUsers: (params) => api.request('GET', '/admin/users', cleanParams(params)),
    getUser: (userId) => api.request('GET', `/admin/users/${userId}`),
    setUserStatus: (userId, active) =>
        api.request('PATCH', `/admin/users/${userId}/status`, { active }),

    // 9-11. products
    listProducts: (params) => api.request('GET', '/admin/products', cleanParams(params)),
    getProduct: (listId) => api.request('GET', `/admin/products/${listId}`),
    setProductStatus: (listId, disabled) =>
        api.request('PATCH', `/admin/products/${listId}/status`, { disabled }),

    // 12-13. support messages (read only)
    listSupportMessages: (params) =>
        api.request('GET', '/admin/support-messages', cleanParams(params)),
    getSupportMessage: (messageId) => api.request('GET', `/admin/support-messages/${messageId}`),
};

export default adminService;
