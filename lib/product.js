import {API_BASE_URL} from "@/lib/api";

export async function getProducts(accessToken) {
    const response = await fetch(`${API_BASE_URL}/products/`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    return response.json();
}

export async function createProduct(accessToken, formData) {
    const response = await fetch(`${API_BASE_URL}/products/`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
    }

    return response.json();
}

export async function updateProduct(accessToken, productId, formData) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
    }

    return response.json();
}

export async function deleteProduct(accessToken, productId) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete product");
    }

    return true;
}
