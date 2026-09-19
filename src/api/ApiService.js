import axios from 'axios';

class ApiService {
	baseURL = 'http://localhost:8080/api';
	client = null;

	constructor() {
		this.client = axios.create({
			baseURL: this.baseURL,
			headers: {
				'Content-Type': 'application/json'
			}
		});

		// Attach JWT token fresh on every request
		this.client.interceptors.request.use((config) => {
			const token = localStorage.getItem('my_app_token') || localStorage.getItem('token');
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		});
	}

	async request(method, url, data = {}, config = {}) {
		try {
			let response;
			const upperMethod = method.toUpperCase();

			if (upperMethod === 'GET') {
				response = await this.client.get(url, { params: data, ...config });
			} else if (upperMethod === 'DELETE') {
				response = await this.client.delete(url, { data, ...config });
			} else {
				response = await this.client[upperMethod.toLowerCase()](url, data, config);
			}

			return response.data;
		} catch (error) {
			console.error(`Error in ${method} request to ${this.baseURL}${url}:`, error);
			throw error;
		}
	}

	get(url, params) { return this.request('GET', url, params); }
	post(url, data, config) { return this.request('POST', url, data, config); }
	put(url, data, config) { return this.request('PUT', url, data, config); }
	patch(url, data, config) { return this.request('PATCH', url, data, config); }
	delete(url, data, config) { return this.request('DELETE', url, data, config); }
}

const apiService = new ApiService();
export default apiService;