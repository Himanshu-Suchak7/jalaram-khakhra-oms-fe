import {API_BASE_URL, authenticatedFetch} from "@/lib/api";

export async function getProducts() {
    const response = await authenticatedFetch(`${API_BASE_URL}/products//`, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    return response.json();
}

export async function createProduct(accessToken, formData) {
    const response = await authenticatedFetch(`${API_BASE_URL}/products/`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
    }

    return response.json();
}

export async function updateProduct(accessToken, productId, formData) {
    const response = await authenticatedFetch(`${API_BASE_URL}/products/${productId}`, {
        method: "PATCH",
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
    }

    return response.json();
}

export async function deleteProduct(accessToken, productId) {
    const response = await authenticatedFetch(`${API_BASE_URL}/products/${productId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete product");
    }

    return true;
}
