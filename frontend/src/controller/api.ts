import axios, { AxiosResponse, Method } from "axios";

class API {
    private url: string;
    private token: string;
    private headers: object;

    constructor() {
        this.url = "https://bistroalpasoar.com/api";
        this.token = `Bearer ${localStorage.getItem('access_token')}`;
        this.headers = {
            "Content-Type": "application/json"
        };
    }

    private async refreshToken(): Promise<boolean> {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            return false;
        }
        try {
            const response = await axios.post(`${this.url}/token/refresh/`, { refresh: refreshToken });
            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            if (refresh) {
                localStorage.setItem('refresh_token', refresh);
            }
            this.token = `Bearer ${access}`;
            return true;
        } catch (error) {
            return false;
        }
    }

    private async request(method: Method, url: string, data?: object, auth: boolean = true): Promise<AxiosResponse | undefined> {
        try {
            return await axios({
                method,
                url: `${this.url}${url}/`,
                data,
                headers: {
                    ...this.headers,
                    ...(auth && { Authorization: this.token })
                }
            });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401 && auth) {
                    // Intenta refrescar el token una vez
                    const refreshed = await this.refreshToken();
                    if (refreshed) {
                        // Reintenta la petición con el nuevo token
                        return this.request(method, url, data, auth);
                    } else {
                        alert("Sesión caducada, por favor vuelve a iniciar sesión");
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        window.location.href = '/admin';
                    }
                }
                return error.response;
            }
            throw error;
        }
    }

    async postAuth(url: string, data: object): Promise<AxiosResponse | undefined> {
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
