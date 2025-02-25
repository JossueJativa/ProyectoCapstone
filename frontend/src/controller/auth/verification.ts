import { JwtPayload, jwtDecode } from 'jwt-decode';

class InvalidTokenError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidTokenError';
    }
}

const verifyToken = async (): Promise<{ success: boolean, message: string }> => {
    const refresh = localStorage.getItem('refresh_token');
    const access = localStorage.getItem('access_token');
    if (!refresh && !access) {
        return { success: false, message: 'No tokens found' };
    }

    try {
        if (!refresh) {
            throw new InvalidTokenError('Refresh token is null');
        }
        const decoded = jwtDecode<JwtPayload>(refresh);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
            throw new InvalidTokenError('Refresh token is expired');
        }
        return { success: true, message: 'Token is valid' };
    } catch (e) {
        if (e instanceof InvalidTokenError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/admin';
            return { success: false, message: e.message };
        }
        console.error(e);
        return { success: false, message: 'An error occurred' };
    }
}

const verifyResponseStatusCode = (statusCode: number, response: Response): boolean => {
    if (response.status === statusCode) {
        return true;
    } else {
        console.error(response);
        return false;
    }
}

export { verifyToken, verifyResponseStatusCode };