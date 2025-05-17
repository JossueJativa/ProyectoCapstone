const verifyResponseStatusCode = (statusCode: number, response: Response): boolean => {
    if (response.status === statusCode) {
        return true;
    } else {
        console.error(response);
        return false;
    }
}

export { verifyResponseStatusCode };