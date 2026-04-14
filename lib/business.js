import {API_BASE_URL} from "@/lib/api";

export async function getBusiness(accessToken) {
    const res = await fetch(`${API_BASE_URL}/business/`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    if (!res.ok) {
        throw new Error("Business not Configured!");
    }
    return res.json();
}

export async function createBusiness(accessToken, formData) {
    const res = await fetch(`${API_BASE_URL}/business/`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body: formData
    })
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to create business");
    }
    return res.json();
}

export async function updateBusiness(accessToken, formData) {
    const res = await fetch(`${API_BASE_URL}/business/`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body: formData
    })
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to update business");
    }
    return res.json();
}