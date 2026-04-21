import {API_BASE_URL, authenticatedFetch} from "@/lib/api";

function extractErrorMessage(errorData) {
    if (!errorData) return null;
    if (typeof errorData.detail === "string") return errorData.detail;
    if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
        return errorData.detail[0]?.msg || null;
    }
    return errorData.message || null;
}

export async function getCustomers() {
    const response = await authenticatedFetch(`${API_BASE_URL}/customers/`, {
        method: "GET",
    });
    if (!response.ok) {
        throw new Error("Failed to fetch customers");
    }

    const data = await response.json();
    const customers = Array.isArray(data) ? data : (data.customers || []);
    return customers.map((customer) => ({
        id: customer.id,
        name: customer.customer_name ?? customer.name ?? "",
        phone_number: customer.customer_phone_number ?? customer.phone_number ?? customer.phone ?? "",
        address: customer.customer_address ?? customer.address ?? "",
        city: customer.customer_city ?? customer.city ?? "",
        status: customer.is_active === false ? "INACTIVE" : "ACTIVE",
    }));
}

export async function createCustomer(accessToken, values) {
    const payload = {
        customer_name: values.name,
        customer_phone_number: values.phone_number,
        customer_address: values.address,
        customer_city: values.city,
    };
    const response = await authenticatedFetch(`${API_BASE_URL}/customers/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(extractErrorMessage(errorData) || "Failed to create customer");
    }

    return response.json();
}

export async function updateCustomer(accessToken, values, customerId) {
    const payload = {
        customer_name: values.name,
        customer_phone_number: values.phone_number,
        customer_address: values.address,
        customer_city: values.city,
    };
    const response = await authenticatedFetch(`${API_BASE_URL}/customers/${customerId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(extractErrorMessage(errorData) || "Failed to update customer");
    }
    return response.json();
}

export async function deleteCustomer(accessToken, customerId) {
    const response = await authenticatedFetch(`${API_BASE_URL}/customers/${customerId}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete customer");
    }
    return true;
}
