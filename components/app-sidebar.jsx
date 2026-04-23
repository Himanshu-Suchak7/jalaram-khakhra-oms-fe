import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {Home, Package, Users, Settings, LogOut, ShoppingCart, UserCog, Warehouse, TrendingUp} from "lucide-react";
import Image from "next/image";
import {usePathname, useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {logout} from "@/lib/auth";
import {toast} from "sonner";
import {useAuth} from "@/lib/auth-context";
import React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";


const navItems = [
    {
        title: "Home",
        href: "/",
        icon: Home,
    },
    {
        title: 'Products',
        href: "/products",
        icon: ShoppingCart,
    },
    {
        title: 'Inventory',
        href: "/inventory",
        icon: Warehouse,
    },
    {
        title: "Orders",
        href: "/orders",
        icon: Package,
    },
    {
        title: "Customers",
        href: "/customers",
        icon: Users,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
];

export function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const {setAccessToken, setUser} = useAuth();
    const {user} = useAuth();
    const { isMobile, openMobile, setOpenMobile } = useSidebar();

    React.useEffect(() => {
        if (isMobile && openMobile) {
            setOpenMobile(false);
        }
    }, [pathname]); // Only close when pathname changes
    async function handleLogout() {
        try {
            await logout();
            setAccessToken(null);
            setUser(null);
            toast.success("Logout successfully");
            router.push("/login");
        } catch (error) {
            toast.error("Logout Failed");
        }
    }

    return (
        <Sidebar>
            <SidebarHeader className={'border-b'}>
                <div className="flex items-center justify-between px-3 py-4">
                    <div className="flex items-center gap-2">
                        <div
                            className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold">
                            <Image src={'/jalaram-bapa-image.png'} width={'32'} height={'32'} alt={'Jalaram Bapa Image'}/>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold">Jalaram Khakhra</span>
                            <span className="text-sm text-muted-foreground">Order Management</span>
                        </div>
                    </div> 
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.href === "/"
                                    ? pathname === "/"
                                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton asChild className={cn(
                                            "flex items-center gap-2 rounded-md px-3 py-2 transition-colors",
                                            "hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/40 dark:hover:text-blue-400",
                                            isActive &&
                                            "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 font-bold"
                                        )}>
                                            <Link href={item.href}>
                                                <Icon/>
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                            {user?.role === "admin" && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        className={cn(
                                            "flex items-center gap-2 rounded-md px-3 py-2 transition-colors",
                                            "hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/40 dark:hover:text-blue-400",
                                            (pathname === "/profit" || pathname.startsWith("/profit/")) && "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 font-bold"
                                        )}
                                    >
                                        <Link href="/profit">
                                            <TrendingUp />
                                            <span>Profit</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                            {user?.role === "admin" && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        className={cn(
                                            "flex items-center gap-2 rounded-md px-3 py-2 transition-colors",
                                            "hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/40 dark:hover:text-blue-400",
                                            (pathname === "/users" || pathname.startsWith("/users/")) && "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 font-bold"
                                        )}
                                    >
                                        <Link href="/users">
                                            <UserCog />
                                            <span>Users</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className={'border-t'}>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout}>
                                <LogOut/>
                                <span>Log out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
