import axios, { AxiosResponse, Method } from "axios";
import { verifyToken } from './auth';

class API {
    private url: string;
    private url_api: string;
    private token: string;
    private headers: object;

    constructor() {
        this.url = "http://localhost:8000";
        this.url_api = `${this.url}/api`;
        this.token = `Bearer ${localStorage.getItem('access_token')}`;
        this.headers = {
            "Content-Type": "application/json"
        };
    }

    async updateToken(): Promise<void> {
        const token = localStorage.getItem('access_token');
        if (!token) {
            return;
        }

        const isTokenValid = await verifyToken();
        if (isTokenValid) {
            return;
        }

        const response = await axios.post(`${this.url}/token/refresh/`, {
            refresh: localStorage.getItem('refresh_token')
        }).catch(() => null);

        if (!response) {
            return;
        }

        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        this.token = `Bearer ${access}`;
    }

    private async request(method: Method, url: string, data?: object, auth: boolean = true): Promise<AxiosResponse | undefined> {
        if (auth) {
            await this.updateToken();
        }
        try {
            return await axios({
                method,
                url: `${this.url_api}${url}/`,
                data,
                headers: {
                    ...this.headers,
                    ...(auth && { Authorization: this.token })
                }
            });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response;
            }
            throw error;
        }
    }

    async postAuth(url: string, data: object): Promise<AxiosResponse | undefined> {
        // Make a POST request without authentication
        try {
            return await axios.post(`${this.url}${url}/`, data, {
                headers: {
                    ...this.headers,
                    Authorization: this.token
                }
            });
        }
    }

    async get(url: string): Promise<AxiosResponse | undefined> {
        return this.request('get', url, undefined, false);
    }

    async post(url: string, data: object): Promise<AxiosResponse | undefined> {
        return this.request('post', url, data);
    }

    async put(url: string, data: object): Promise<AxiosResponse | undefined> {
        return this.request('put', url, data);
    }

    async delete(url: string): Promise<AxiosResponse | undefined> {
        return this.request('delete', url);
    }

    async postOrder(data: object, url: string): Promise<AxiosResponse | undefined> {
        return this.request('post', url, data, false);
    }

    async putOrder(data: object, url: string): Promise<AxiosResponse | undefined> {
        return this.request('put', url, data, false);
    }

    async deleteOrder(url: string): Promise<AxiosResponse | undefined> {
        return this.request('delete', url, undefined, false);
    }
}

export { API };
