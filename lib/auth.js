import {API_BASE_URL} from "@/lib/api";

export async function login(phone_number, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({phone_number, password})
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Login failed");
    }
    const data = await res.json();
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    return data;
}

export async function logout() {
    await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
    });
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
}

export async function refreshToken() {
    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token) {
        localStorage.removeItem("access_token");
        throw new Error("No refresh token found");
    }

    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${refresh_token}`
        }
    });

    if (!res.ok) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        throw new Error("Refresh token expired");
    }

    const data = await res.json();
    localStorage.setItem("access_token", data.access_token);
    return data;
}