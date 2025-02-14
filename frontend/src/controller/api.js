import axios from "axios";

import { verifyToken } from './auth';

class API {
    constructor() {
        this.url = "http://localhost:8000";
        this.url_api = `${this.url}/api`;
        this.token = `Bearer ${localStorage.getItem('access_token')}`;
        this.headers = {
            "Content-Type": "application/json"
        };
    }

    async updateToken() {
        const token = localStorage.getItem('access_token');
        if (!token) {
            return;
        }

        const isTokenValid = await verifyToken(token);
        if (isTokenValid) {
            return;
        }

        const { access, refresh } = await axios.post(`${this.url}/token/refresh/`, {
            refresh: localStorage.getItem('refresh_token')
        })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                return null;
            });

        if (!newToken) {
            return;
        }

        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        this.token = `Bearer ${access}`;
    }

    // Auth controller
    async postAuth(url, data) {
        try{
            return await axios.post(`${this.url}/user${url}/`, data, this.headers);
        } catch (error) {
            return error.response;
        }
    }

    async get(url) {
        try {
            return await axios.get(`${this.url_api}${url}/`, this.headers);
        } catch (error) {
            return error.response;
        }
    }

    // Admin controller
    async post(url, data) {
        this.updateToken();
        try{
            return await axios.post(`${this.url_api}${url}/`, data, {
                headers: {
                    ...this.headers,
                    Authorization: this.token
                }
            });
        } catch (error) {
            return error.response;
        }
    }

    async put(url, data) {
        this.updateToken();
        try {
            return await axios.put(`${this.url_api}${url}/`, data, {
                headers: {
                    ...this.headers,
                    Authorization: this.token
                }
            });
        } catch (error) {
            return error.response;
        }
    }

    async delete(url) {
        this.updateToken();
        try {
            return await axios.delete(`${this.url_api}${url}/`, {
                headers: {
                    ...this.headers,
                    Authorization: this.token
                }
            });
        } catch (error) {
            return error.response;
        }
    }

    // Controlador para realizar con Ordenes
    async postOrder(data, url) {
        try {
            return await axios.post(`${this.url_api}${url}/`, data, this.headers);
        } catch (error) {
            return error.response;
        }
    }

    async putOrder(data, url) {
        try {
            return await axios.put(`${this.url_api}${url}/`, data, this.headers);
        } catch (error) {
            return error.response;
        }
    }

    async deleteOrder(url) {
        try {
            return await axios.delete(`${this.url_api}${url}/`, this.headers);
        } catch (error) {
            return error.response;
        }
    }
}

export { API };