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
            setAccessToken(null);
            setUser(null);
            setLoading(false);
            return;
        }

        async function initAuth() {
            try {
                let token = localStorage.getItem("access_token");
                
                if (!token) {
                    const tokenData = await refreshToken();
                    token = tokenData.access_token;
                }

                setAccessToken(token);

                const me = await getCurrentUser();
                setUser(me);

            } catch (error) {
                console.error("Auth initialization failed:", error);
                setAccessToken(null);
                setUser(null);
                if (pathname !== "/login") {
                    router.replace("/login");
                }
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