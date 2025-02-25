import { API } from '../api';

const api = new API();

const LoginAuth = async (username: string, password: string): Promise<boolean> => {
    const response = await api.postAuth('/login', { username: username, password: password });
    if (response?.status === 200) {
        const { access, refresh } = response.data;
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('access_token', access);
        return true;
    } else {
        return false;
    }
}

const LogoutAuth = async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    const response = await api.postAuth('/logout', { refresh: token });
    if (response?.status === 201) {
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('access_token');
        return true;
    } else {
        return false;
    }
}

const RegisterAuth = async (username: string, password: string): Promise<boolean> => {
    const response = await api.postAuth('/register', { username: username, password: password });
    if (response?.status === 201) {
        return true;
    } else {
        return false;
    }
}

export { LoginAuth, LogoutAuth, RegisterAuth };