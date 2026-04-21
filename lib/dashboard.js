import { API_BASE_URL, authenticatedFetch } from "@/lib/api";

export async function getDashboardOverview() {
    const response = await authenticatedFetch(`${API_BASE_URL}/dashboard/overview`);
    if (!response.ok) {
        throw new Error("Failed to fetch dashboard overview");
    }
    return response.json();
}
