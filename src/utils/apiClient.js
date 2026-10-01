import { getAccessToken } from "./auth";
import { refreshAccessToken } from "./refreshToken";

const API_URL = "https://tamkeen-backend-production.up.railway.app/api";

export const apiRequest = async (endpoint, options = {}) => {
    let token = getAccessToken();

    const makeRequest = (tok) =>
        fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${tok}`,
                "Content-Type": "application/json",
            },
        });

    let res = await makeRequest(token);

    if (res.status === 401) {
        const newToken = await refreshAccessToken();

        if (!newToken) return res;

        res = await makeRequest(newToken);
    }

    return res;
};