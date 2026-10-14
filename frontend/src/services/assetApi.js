import apiRequest from "./api.js";

export const assetApi = {
    createAsset: (assetData) => apiRequest('/assets', {
        method: 'POST',
        body: JSON.stringify(assetData),
    }),
    getAssets: () => apiRequest('/assets'),
    getAssetById: (id) => apiRequest(`/assets/${id}`),
    updateAsset: (id, assetData) => apiRequest(`/assets/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(assetData),
    }),
    deleteAsset: (id) => apiRequest(`/assets/${id}`, {
        method: 'DELETE',
    }),
};

export default assetApi;