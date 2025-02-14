import { API } from './api';

const getDesk = async() => {
    const api = new API();
    const response = await api.get('/desk');
    return response.data;
}

export { getDesk };