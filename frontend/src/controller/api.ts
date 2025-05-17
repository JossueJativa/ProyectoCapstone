import axios, { AxiosResponse, Method } from "axios";
import { verifyToken } from './auth';

class API {
    private url: string;
    private url_api: string;
    private token: string;
    private headers: object;

    constructor() {
        this.url = "https://bistroalpasoar.com";
        this.url_api = `${this.url}/api`;
        this.token = `Bearer ${localStorage.getItem('access_token')}`;
        this.headers = {
            "Content-Type": "application/json"
        };
    }

    async updateToken(): Promise<void> {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            console.error("No refresh token available");
            return;
        }

        try {
            const response = await axios.post(`${this.url}/token/refresh/`, {
                refresh: refreshToken
            });

            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            this.token = `Bearer ${access}`;
        } catch (error) {
            console.error("Failed to refresh token", error);
        }
    }

    private async request(method: Method, url: string, data?: object, auth: boolean = true): Promise<AxiosResponse | undefined> {
        if (auth) {
            await this.ensureValidToken();
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
                // Handle 401 errors (unauthorized) and try refreshing the token
                if (error.response.status === 401 && auth) {
                    console.warn("Token expired, attempting to refresh...");
                    await this.updateToken();
                    return this.request(method, url, data, auth); // Retry the request
                }
                return error.response;
            }
            throw error;
        }
    }

    private async ensureValidToken(): Promise<void> {
        const isTokenValid = await verifyToken();
        if (!isTokenValid) {
            console.warn("Token is invalid or expired, refreshing...");
            await this.updateToken();
        }
    }

    async postAuth(url: string, data: object): Promise<AxiosResponse | undefined> {
        // Make a POST request without authentication
        try {
            return await axios.post(`${this.url}/user${url}/`, data, {
                headers: {
                    ...this.headers,
                    Authorization: this.token
                }
            });
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response;
            }
            throw error;
        }
    }

    async getAuth(url: string, token: string): Promise<AxiosResponse | undefined> {
        try {
            return await axios.get(`${this.url}/user${url}/`, {
                headers: {
                    ...this.headers,
                    Authorization: `Bearer ${token}`
                }
            });
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response;
            }
            throw error;
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
