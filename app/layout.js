import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {AuthProvider} from "@/lib/auth-context";
import {Toaster} from "@/components/ui/sonner";
import QueryProvider from "@/components/QueryProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Jalaram Khakhra",
    description: "Order Management System for Jalaram Khakhra",
    icons: {
        icon: '/jalaram-bapa-image.png',
        shortcut: '/jalaram-bapa-image.png',
        apple: '/jalaram-bapa-image.png',
    },
    appleWebApp: {
        title: "Jalaram Khakhra",
        statusBarStyle: "black-translucent",
        capable: true,
    },
};

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <AuthProvider>
            <QueryProvider>
                {children}
            </QueryProvider>
            <Toaster position={'top-right'} richColors/>
        </AuthProvider>
        </body>
        </html>
    );
}
