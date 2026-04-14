"use client";

import {createContext, useContext, useEffect, useState} from "react";
import {useRouter, usePathname} from "next/navigation";
import {refreshToken} from "@/lib/auth";
import {getCurrentUser} from "@/lib/user";

const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === "/login") {
            setLoading(false);
            return;
        }

        async function initAuth() {
            try {
                // 1️⃣ Refresh access token (cookie-based)
                const tokenData = await refreshToken();

                setAccessToken(tokenData.access_token);

                // 2️⃣ Fetch current user
                const me = await getCurrentUser(tokenData.access_token);
                setUser(me);

            } catch (error) {
                setAccessToken(null);
                setUser(null);
                router.replace("/login");
            } finally {
                setLoading(false);
            }
        }

        initAuth();
    }, [pathname]);

    return (
        <AuthContext.Provider
            value={{accessToken, setAccessToken, user, setUser, loading}}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}