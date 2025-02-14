import { API } from './api';

const createDesk = async(data) => {
    const api = new API();
    const response = await api.post('/desk', data);
    return response.data;
}

export { createDesk };
