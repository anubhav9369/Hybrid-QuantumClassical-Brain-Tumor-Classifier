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

    // Use AbortController for timeout (3 min for deployed backend)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000);

    try {
        const response = await fetch(`${API_BASE}/predict?gradcam=false`, {
            method: 'POST',
            body: formData,
            signal: controller.signal,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Server error' }));
            throw new Error(error.detail || `HTTP ${response.status}`);
        }

        return response.json();
    } catch (err) {
        if (err.name === 'AbortError') {
            throw new Error('Request timed out. The server may be waking up — please try again.');
        }
        throw err;
    } finally {
        clearTimeout(timeout);
    }
}

/**
 * Check backend health.
 * @returns {Promise<Object>}
 */
export async function checkHealth() {
    const response = await fetch(`${API_BASE}/health`);
    return response.json();
}
