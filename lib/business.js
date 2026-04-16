import {API_BASE_URL, authenticatedFetch} from "@/lib/api";

export async function getBusiness() {
    const res = await authenticatedFetch(`${API_BASE_URL}/business/`, {
        method: "GET",
    });
    if (!res.ok) {
        throw new Error("Business not Configured!");
    }
    return res.json();
}

export async function createBusiness(accessToken, formData) {
    const res = await authenticatedFetch(`${API_BASE_URL}/business/`, {
        method: "POST",
        body: formData
    })
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to create business");
    }
    return res.json();
}

export async function updateBusiness(accessToken, formData) {
    const res = await authenticatedFetch(`${API_BASE_URL}/business/`, {
        method: "PATCH",
        body: formData
    })
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to update business");
    }
    return res.json();
}