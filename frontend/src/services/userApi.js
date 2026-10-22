import apiRequest from './api.js';

const userApi = {
    getUsers: () => apiRequest('/users'),

    getEmployees: () => apiRequest('/users/employees'),

    updateUser: (id, userData) =>
        apiRequest(`/users/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(userData),
        }),

    deleteUser: (id) =>
        apiRequest(`/users/${id}`, {
            method: 'DELETE',
        }),
};

export default userApi;