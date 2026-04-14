import {API_BASE_URL} from "@/lib/api";

export async function login(phone_number, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({phone_number, password})
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Login failed");
    }
    return res.json();
}

export async function logout() {
    const res = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    })
}

export async function refreshToken() {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
    });
    if (!res.ok) {
        throw new Error("Refresh token expired");
    }
    return res.json();
}