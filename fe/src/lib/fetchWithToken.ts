let fetchWithToken = (url, accessToken, options = {}) => {
    const headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`
    };

    const requestOptions = {
        ...options,
        headers
    };

    return fetch(url, requestOptions).then(res => res.json());
};

export default fetchWithToken;

