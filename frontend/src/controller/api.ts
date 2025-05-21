import axios, { AxiosResponse, Method } from "axios";

class API {
    private url = "https://bistroalpasoar.com/api";
    private headers: Record<string, string> = { "Content-Type": "application/json" };

    private getToken() {
        const token = localStorage.getItem('access_token');
        return token ? `Bearer ${token}` : undefined;
    }

    private async refreshToken() {
        const refreshToken = localStorage.getItem('access_token');
        if (!refreshToken) return false;
        try {
            const response = await axios.post(`${this.url}/user/token/refresh/`, { refresh: refreshToken });
            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            if (refresh) localStorage.setItem('access_token', refresh);
            return true;
        } catch {
            return false;
        }
    }

    private async request(method: Method, url: string, data?: object): Promise<AxiosResponse | undefined> {
        let headers: Record<string, string> = { ...this.headers };
        const token = this.getToken();
        if (token) headers["Authorization"] = token;
        try {
            return await axios({ method, url: `${this.url}${url}/`, data, headers });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response && error.response.status === 403) {
                alert("No tienes permisos para realizar esta acción");
            }
            if (axios.isAxiosError(error) && error.response && error.response.status === 401 && token) {
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    const newToken = this.getToken();
                    if (newToken) headers["Authorization"] = newToken;
                    return await axios({ method, url: `${this.url}${url}/`, data, headers });
                } else {
                    alert("Sesión caducada, por favor vuelve a iniciar sesión");
                    localStorage.removeItem('access_token');
                    window.location.href = '/admin';
                }
            }
            if (axios.isAxiosError(error) && error.response) return error.response;
            throw error;
        }
    }

    get(url: string) {
        return this.request('get', url);
    }
    post(url: string, data: object) {
        return this.request('post', url, data);
    }
    put(url: string, data: object) {
        return this.request('put', url, data);
    }
    delete(url: string) {
        return this.request('delete', url);
    }
}

export { API };
