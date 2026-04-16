export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function authenticatedFetch(url, options = {}) {
    let accessToken = localStorage.getItem("access_token");

    const headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
    };

    let response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        const refreshTokenValue = localStorage.getItem("refresh_token");
        if (!refreshTokenValue) {
            handleAuthFailure();
            throw new Error("Unauthorized");
        }

        // Try to refresh token
        try {
            const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${refreshTokenValue}`,
                },
            });

            if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                localStorage.setItem("access_token", data.access_token);
                accessToken = data.access_token;

                // Retry original request
                response = await fetch(url, {
                    ...options,
                    headers: {
                        ...options.headers,
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok && response.status === 401) {
                    handleAuthFailure();
                }
            } else {
                handleAuthFailure();
                throw new Error("Refresh token expired");
            }
        } catch (error) {
            handleAuthFailure();
            throw error;
        }
    }

    return response;
}

function handleAuthFailure() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    if (typeof window !== "undefined") {
        window.location.href = "/login";
    }
}