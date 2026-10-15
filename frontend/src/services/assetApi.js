import apiRequest from "./api.js";

export const assetApi = {
    // Create Asset
    createAsset: (assetData) => apiRequest('/assets', {
        method: 'POST',
        body: JSON.stringify(assetData),
    }),
    // Get All Assets
    getAssets: () => apiRequest('/assets'),
    getAssetById: (id) => apiRequest(`/assets/${id}`),
    // Update Asset
    updateAsset: (id, assetData) => apiRequest(`/assets/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(assetData),
    }),
    // Delete Asset
    deleteAsset: (id) => apiRequest(`/assets/${id}`, {
        method: 'DELETE',
    }),
};

export default assetApi;

// 1. Create Asset
// 2. Get All Assets
// 3. Get Asset by ID
// 4. Update Asset
// 5. Delete Asset

//! This file is the entry point of the backend application. It helps you to create a new asset, get all assets, get an asset by ID, update an asset, and delete an asset.