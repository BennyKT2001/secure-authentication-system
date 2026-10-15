const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function apiRequest(endpoint, options = {} ) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        },
    });

    let payload;
    try {
        payload = await response.json();
    } catch {
        // payload = null;
        // The response may not contain a JSON body
    }

    if (!response.ok) {
        const error = new Error(
        payload?.message || 'Something went wrong. Please try again.',
        );

        error.status = response.status;
        error.payload = payload;
        throw error;
    }

    return payload;
}

export const authApi = {
    login: ({ email, password }) =>
        apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    verifyLoginOtp: ({ email, otp }) =>
        apiRequest('/auth/verify-login-otp', {
            method: 'POST',
            body: JSON.stringify({ email, otp }),
        }),

    register: ({ fullName, email, phoneNumber, password }) =>
        apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ fullName, email, phoneNumber, password }),
        }),

    verifyRegistrationOtp: ({ email, otp }) =>
        apiRequest('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ email, otp }),
        }),

    getCurrentUser: () => apiRequest('/auth/me'),

    logout: () =>
        apiRequest('/auth/logout', {
            method: 'POST',
        }),
};

export default apiRequest;