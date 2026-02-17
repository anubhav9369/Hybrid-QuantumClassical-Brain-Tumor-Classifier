/**
 * API layer for communicating with the FastAPI backend.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Upload an MRI image and get classification results.
 * @param {File} file - The MRI image file
 * @returns {Promise<Object>} - Prediction results
 */
export async function analyzeMRI(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Server error' }));
        throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
}

/**
 * Check backend health.
 * @returns {Promise<Object>}
 */
export async function checkHealth() {
    const response = await fetch(`${API_BASE}/health`);
    return response.json();
}
