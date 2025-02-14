import { jwtDecode, InvalidTokenError } from 'jwt-decode';

const verifyToken = async () => {
    const refresh = localStorage.getItem('refresh_token');
    const access = localStorage.getItem('access_token');
    if (!refresh && !access) {
        return false;
    }

    try {
        const decoded = jwtDecode(refresh);
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp > currentTime;
    } catch (e) {
        if (e instanceof InvalidTokenError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/admin';
            return false;
        }
        console.error(e);
        return false;
    }
}

const verifyResponseStatusCode = (statusCode, response) => {
    if (response.statusCode === statusCode) {
        return true;
    } else {
        console.error(response);
        return false;
    }
}

export { verifyToken, verifyResponseStatusCode };
    