import apiRequest from './api.js';

export const auditLogApi = {
  getLogs: () => apiRequest('/audit-logs'),
};

export default auditLogApi;
