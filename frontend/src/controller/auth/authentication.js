import { API } from '../api';

const api = new API();

const LoginAuth = async (username, password) => {
    const response = await api.postAuth('/login', { username: username, password: password });
    if (response.status === 200) {
        const { access } = response.data;
        localStorage.setItem('token', access);
        return true;
    } else {
        return false;
    }
}

export { LoginAuth };