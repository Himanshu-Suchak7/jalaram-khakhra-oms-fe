import {API_BASE_URL} from "@/lib/api";

export async function getCurrentUser(accessToken) {
    const res = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error("Unauthorized");
    }

    return res.json();
}

export async function updateCurrentUser(accessToken, formData) {
    const res = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to update profile");
    }
    return res.json();
}

export async function getUsers(accessToken) {
    const res = await fetch(`${API_BASE_URL}/users/`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch users");
    }
    return res.json();
}

export async function createUser(accessToken, user) {
    const res = await fetch(`${API_BASE_URL}/users/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(user),
    });
    if (!res.ok) {
        throw new Error("Failed to create user");
    }
    return res.json();
}

export async function updateUserRole(accessToken, userId, role) {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({role}),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update user role");
    }
    return res.json();
}

export async function deleteUser(accessToken, userId) {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to delete user");
    }
    return true;
}

export async function adminChangePassword(accessToken, userId, newPassword) {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/change-password`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({new_password: newPassword}),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to change user password");
    }
    return res.json();
}