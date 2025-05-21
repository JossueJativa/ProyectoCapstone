import { API } from '../api';

const api = new API();

const LoginAuth = async (username: string, password: string): Promise<boolean> => {
    const response = await api.post('/user/login', { username: username, password: password });
    if (response?.status === 200) {
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        return true;
    } else {
        return false;
    }
}

const LogoutAuth = async (): Promise<boolean> => {
    localStorage.removeItem('access_token');
    return true;
}

const GetUserAuth = async (): Promise<any> => {
    const token = localStorage.getItem('access_token');
    // Sacar el user_id del token
    const payload = token?.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload || ''));
    const userId = decodedPayload?.user_id;
    if (!userId) {
        return null;
    }
    const response = await api.get(`/user/${userId}`);
    if (response?.status === 200) {
        return response.data;
    } else {
        return null;
    }
}

export { LoginAuth, LogoutAuth, GetUserAuth };