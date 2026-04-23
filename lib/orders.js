import { API_BASE_URL, authenticatedFetch } from "@/lib/api";

async function parseApiError(response) {
    let payload = null;
    try {
        payload = await response.json();
    } catch {
        // ignore
    }

    const detail = payload?.detail ?? payload;
    if (detail?.code === "MISSING_COST_PRICE") {
        const names = Array.isArray(detail.missing_products)
            ? detail.missing_products.map(p => p.product_name).filter(Boolean)
            : [];
        const suffix = names.length ? ` Missing: ${names.join(", ")}.` : "";
        return `${detail.message || "Cost price is required for all items."}${suffix} Please add cost price in Products and try again.`;
    }

    return detail?.message || detail?.detail || "Request failed";
}

export async function getOrders(params = {}) {
    const url = new URL(`${API_BASE_URL}/orders/`);
    Object.keys(params).forEach(key => {
        if (params[key]) url.searchParams.append(key, params[key]);
    });

    const response = await authenticatedFetch(url.toString());
    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
}

export async function getOrderDetails(orderId) {
    const response = await authenticatedFetch(`${API_BASE_URL}/orders/${orderId}`);
    if (!response.ok) throw new Error("Failed to fetch order details");
    return response.json();
}

export async function updateOrder(orderId, data) {
    const response = await authenticatedFetch(`${API_BASE_URL}/orders/${orderId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await parseApiError(response));
    return response.json();
}

export async function createOrder(data) {
    const response = await authenticatedFetch(`${API_BASE_URL}/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await parseApiError(response));
    return response.json();
}

export async function updateOrderStatus(orderId, status) {
    const response = await authenticatedFetch(`${API_BASE_URL}/orders/${orderId}/status/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error(await parseApiError(response));
    return response.json();
}

export async function updatePaymentStatus(orderId, status) {
    const response = await authenticatedFetch(`${API_BASE_URL}/orders/${orderId}/payment-status/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error(await parseApiError(response));
    return response.json();
}

export async function getInvoiceData(orderId) {
    const response = await authenticatedFetch(`${API_BASE_URL}/orders/${orderId}/invoice`);
    if (!response.ok) throw new Error(await parseApiError(response));
    return response.json();
}

export async function downloadInvoicePdf(orderId, fileName = "invoice.pdf") {
    const response = await authenticatedFetch(`${API_BASE_URL}/orders/${orderId}/invoice.pdf`);
    if (!response.ok) throw new Error(await parseApiError(response));
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

export async function deleteOrder(orderId) {
    const response = await authenticatedFetch(`${API_BASE_URL}/orders/${orderId}/`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error(await parseApiError(response));
    return true;
}
