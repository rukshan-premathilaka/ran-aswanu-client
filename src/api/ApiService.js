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

		// Attach the token fresh on every request, not just at construction time
		this.client.interceptors.request.use((config) => {
			const token = localStorage.getItem('my_app_token');
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		});
	}

	async request(method, url, data = {}) {
		try {
			let response;

			switch (method.toUpperCase()) {
				case 'GET':
					response = await this.client.get(url, { params: data });
					break;
				case 'POST':
					response = await this.client.post(url, data);
					break;
				case 'PUT':
					response = await this.client.put(url, data);
					break;
				case 'PATCH':
					response = await this.client.patch(url, data);
					break;
				case 'DELETE':
					response = await this.client.delete(url, { data });
					break;
				default:
					throw new Error(`Invalid request method: ${method}`);
			}

			return response.data;
		} catch (error) {
			console.error(`Error in ${method} request to ${this.baseURL}${url}:`, error);
			throw error;
		}
	}
}

export default ApiService;