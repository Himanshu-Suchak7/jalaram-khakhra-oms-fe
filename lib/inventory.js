import {API_BASE_URL, authenticatedFetch} from "@/lib/api";

async function parseApiError(response) {
    let payload = null;
    try {
        payload = await response.json();
    } catch {
        // ignore
    }
    const detail = payload?.detail ?? payload;
    return detail?.message || detail?.detail || detail || "Request failed";
}

export async function getInventorySummary() {
    const response = await authenticatedFetch(`${API_BASE_URL}/inventory/summary`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error("Failed to fetch inventory summary");
    }

    return response.json();
}

export async function getInventory(search = "") {
    const url = new URL(`${API_BASE_URL}/inventory/items`);
    if (search) {
        url.searchParams.append("search", search);
    }
    const response = await authenticatedFetch(url.toString(), {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error("Failed to fetch inventory");
    }
    return response.json();
}

export async function addInventoryTransaction(data) {
    const response = await authenticatedFetch(`${API_BASE_URL}/inventory/transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        throw new Error(await parseApiError(response))
    }

    return response.json();
}
