import { API_BASE_URL, authenticatedFetch } from "@/lib/api";

async function ensureOk(response) {
    if (response.ok) return;
    let payload = null;
    try {
        payload = await response.json();
    } catch {
        // ignore
    }
    const detail = payload?.detail ?? payload;
    throw new Error(detail?.message || detail?.detail || "Failed to fetch profit data");
}

export async function getProfitSummary() {
    const res = await authenticatedFetch(`${API_BASE_URL}/dashboard/profit-summary`, { method: "GET" });
    await ensureOk(res);
    return res.json();
}

export async function getProfitProducts(params = {}) {
    const url = new URL(`${API_BASE_URL}/profit/products`);
    if (params.from_date) url.searchParams.append("from_date", params.from_date);
    if (params.to_date) url.searchParams.append("to_date", params.to_date);

    const res = await authenticatedFetch(url.toString(), { method: "GET" });
    await ensureOk(res);
    return res.json();
}

export async function getProfitOrders(params = {}) {
    const url = new URL(`${API_BASE_URL}/profit/orders`);
    if (params.from_date) url.searchParams.append("from_date", params.from_date);
    if (params.to_date) url.searchParams.append("to_date", params.to_date);

    const res = await authenticatedFetch(url.toString(), { method: "GET" });
    await ensureOk(res);
    return res.json();
}
