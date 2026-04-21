import { API_BASE_URL, authenticatedFetch } from "@/lib/api";

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
    if (!response.ok) throw new Error("Failed to update order");
    return response.json();
}

export async function createOrder(data) {
    const response = await authenticatedFetch(`${API_BASE_URL}/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create order");
    return response.json();
}

export async function updateOrderStatus(orderId, status) {
    const response = await authenticatedFetch(`${API_BASE_URL}/orders/${orderId}/status/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update status");
    return response.json();
}

export async function updatePaymentStatus(orderId, status) {
    const response = await authenticatedFetch(`${API_BASE_URL}/orders/${orderId}/payment-status/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update payment status");
    return response.json();
}

export async function getInvoiceData(orderId) {
    const response = await authenticatedFetch(`${API_BASE_URL}/orders/${orderId}/invoice`);
    if (!response.ok) throw new Error("Failed to fetch invoice data");
    return response.json();
}

export async function downloadInvoicePdf(orderId, fileName = "invoice.pdf") {
    const response = await authenticatedFetch(`${API_BASE_URL}/orders/${orderId}/invoice.pdf`);
    if (!response.ok) throw new Error("Failed to download invoice");
    
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
    if (!response.ok) throw new Error("Failed to delete order");
    return true;
}
