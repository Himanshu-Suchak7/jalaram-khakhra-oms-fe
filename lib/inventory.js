import {API_BASE_URL, authenticatedFetch} from "@/lib/api";

export async function getInventorySummary() {
    const response = await authenticatedFetch(`${API_BASE_URL}/inventory/summary`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error("Failed to fetch inventory summary");
    }

    return response.json();
}

export async function getInventory() {
    const response = await authenticatedFetch(`${API_BASE_URL}/inventory/items`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error("Failed to fetch inventory");
    }
    return response.json();
}