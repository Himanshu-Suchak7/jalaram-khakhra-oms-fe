'use client'

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { IndianRupee, TrendingUp, Wallet, CalendarDays, BadgeCheck, BadgeIndianRupee, AlertTriangle } from "lucide-react";

import PageHeader from "@/components/shared/PageHeader";
import SummaryCard from "@/components/shared/SummaryCard";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { getProfitOrders, getProfitProducts, getProfitSummary } from "@/lib/profit";

export default function ProfitPage() {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

    const summaryQuery = useQuery({
        queryKey: ["profit-summary"],
        queryFn: getProfitSummary,
        enabled: isAdmin,
    });

    const productsQuery = useQuery({
        queryKey: ["profit-products"],
        queryFn: () => getProfitProducts(),
        enabled: isAdmin,
    });

    const ordersQuery = useQuery({
        queryKey: ["profit-orders"],
        queryFn: () => getProfitOrders(),
        enabled: isAdmin,
    });

    const loading = summaryQuery.isLoading || productsQuery.isLoading || ordersQuery.isLoading;
    const summary = summaryQuery.data;
    const productRows = productsQuery.data?.items || [];
    const orderRows = ordersQuery.data?.orders || [];

    const topProduct = productRows?.[0];
    const bestOrder = useMemo(() => {
        if (!Array.isArray(orderRows) || orderRows.length === 0) return null;
        return [...orderRows].sort((a, b) => (b.profit || 0) - (a.profit || 0))[0];
    }, [orderRows]);

    if (!isAdmin) {
        return (
            <div className="p-10 text-center text-gray-700 font-bold">
                Admin access required to view profit analytics.
            </div>
        );
    }

    if (summaryQuery.isError || productsQuery.isError || ordersQuery.isError) {
        return (
            <div className="p-10 text-center text-red-600 font-bold">
                Failed to load profit analytics. Please retry.
            </div>
        );
    }

    const cards = summary ? [
        { title: "Accrued Profit (Total)", value: `₹ ${Number(summary.accrued.total_profit || 0).toLocaleString()}`, icon: TrendingUp, iconColor: "text-emerald-600" },
        { title: "Realized Profit (Total)", value: `₹ ${Number(summary.realized.total_profit || 0).toLocaleString()}`, icon: Wallet, iconColor: "text-blue-600" },
        { title: "Accrued Profit (Today)", value: `₹ ${Number(summary.accrued.today_profit || 0).toLocaleString()}`, icon: CalendarDays, iconColor: "text-emerald-600" },
        { title: "Realized Profit (Today)", value: `₹ ${Number(summary.realized.today_profit || 0).toLocaleString()}`, icon: CalendarDays, iconColor: "text-blue-600" },
        { title: "Accrued Profit (Month)", value: `₹ ${Number(summary.accrued.month_profit || 0).toLocaleString()}`, icon: BadgeIndianRupee, iconColor: "text-emerald-600" },
        { title: "Realized Profit (Month)", value: `₹ ${Number(summary.realized.month_profit || 0).toLocaleString()}`, icon: BadgeCheck, iconColor: "text-blue-600" },
        { title: "Fulfilled Orders (Month)", value: Number(summary.fulfilled_orders_month || 0).toLocaleString(), icon: IndianRupee, iconColor: "text-gray-700" },
        { title: "Paid+Fulfilled (Month)", value: Number(summary.realized_orders_month || 0).toLocaleString(), icon: IndianRupee, iconColor: "text-gray-700" },
    ] : [];

    return (
        <div className="space-y-8">
            <PageHeader
                title="Profit Analytics"
                description="Track accrued vs realized profit for fulfilled orders (IST)."
            />

            {loading ? (
                <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'}>
                    {Array.from({ length: 8 }).map((_, idx) => (
                        <SummaryCard key={idx} isLoading={true} />
                    ))}
                </div>
            ) : (
                <>
                    {summary?.missing_profit_orders_total > 0 && (
                        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900">
                            <AlertTriangle className="w-5 h-5" />
                            <div className="text-sm font-semibold">
                                {summary.missing_profit_orders_total} fulfilled order(s) are excluded from profit because cost/profit snapshots are missing.
                            </div>
                        </div>
                    )}

                    <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'}>
                        {cards.map((c, idx) => (
                            <SummaryCard key={idx} title={c.title} value={c.value} icon={c.icon} iconColor={c.iconColor} />
                        ))}
                    </div>
                </>
            )}

            <div className={'grid grid-cols-1 lg:grid-cols-2 gap-8'}>
                <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900">Top Product (by Profit)</h3>
                    {loading ? (
                        <Skeleton className="h-10 w-2/3 mt-4 rounded-xl" />
                    ) : topProduct ? (
                        <div className="mt-4 space-y-1">
                            <div className="text-2xl font-black text-blue-700">{topProduct.product_name}</div>
                            <div className="text-gray-600 font-semibold">Profit: ₹ {Number(topProduct.profit || 0).toLocaleString()}</div>
                        </div>
                    ) : (
                        <div className="mt-4 text-gray-500 font-semibold">No data yet.</div>
                    )}
                </Card>

                <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900">Best Order (by Profit)</h3>
                    {loading ? (
                        <Skeleton className="h-10 w-2/3 mt-4 rounded-xl" />
                    ) : bestOrder ? (
                        <div className="mt-4 space-y-1">
                            <div className="text-2xl font-black text-blue-700">{bestOrder.order_number}</div>
                            <div className="text-gray-600 font-semibold">Profit: ₹ {Number(bestOrder.profit || 0).toLocaleString()}</div>
                        </div>
                    ) : (
                        <div className="mt-4 text-gray-500 font-semibold">No data yet.</div>
                    )}
                </Card>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Product Profit</h2>
                <Card className={'p-0 overflow-hidden border-gray-100 rounded-2xl shadow-sm'}>
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="hover:bg-transparent border-gray-100">
                                <TableHead className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">PRODUCT</TableHead>
                                <TableHead className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">QTY (KG)</TableHead>
                                <TableHead className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">REVENUE</TableHead>
                                <TableHead className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">PROFIT</TableHead>
                                <TableHead className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">MARGIN %</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 6 }).map((_, idx) => (
                                    <TableRow key={idx} className="border-gray-100">
                                        <TableCell className="px-6 py-5"><Skeleton className="h-5 w-40 rounded" /></TableCell>
                                        <TableCell className="px-6 py-5 text-right"><Skeleton className="h-5 w-16 ml-auto rounded" /></TableCell>
                                        <TableCell className="px-6 py-5 text-right"><Skeleton className="h-5 w-20 ml-auto rounded" /></TableCell>
                                        <TableCell className="px-6 py-5 text-right"><Skeleton className="h-5 w-20 ml-auto rounded" /></TableCell>
                                        <TableCell className="px-6 py-5 text-right"><Skeleton className="h-5 w-14 ml-auto rounded" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                (productRows || []).slice(0, 50).map((row) => (
                                    <TableRow key={row.product_id} className="group hover:bg-gray-50 transition-colors border-gray-100">
                                        <TableCell className="px-6 py-5 font-bold text-gray-900">{row.product_name}</TableCell>
                                        <TableCell className="px-6 py-5 text-right font-semibold text-gray-700">{Number(row.quantity_sold_kg || 0).toLocaleString()}</TableCell>
                                        <TableCell className="px-6 py-5 text-right font-semibold text-gray-700">₹ {Number(row.revenue || 0).toLocaleString()}</TableCell>
                                        <TableCell className="px-6 py-5 text-right font-black text-emerald-700">₹ {Number(row.profit || 0).toLocaleString()}</TableCell>
                                        <TableCell className="px-6 py-5 text-right font-semibold text-gray-700">{row.margin_percent == null ? "-" : `${row.margin_percent}%`}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Order Profit</h2>
                <Card className={'p-0 overflow-hidden border-gray-100 rounded-2xl shadow-sm'}>
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="hover:bg-transparent border-gray-100">
                                <TableHead className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">ORDER</TableHead>
                                <TableHead className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">DATE</TableHead>
                                <TableHead className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">PAYMENT</TableHead>
                                <TableHead className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">REVENUE</TableHead>
                                <TableHead className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">PROFIT</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 6 }).map((_, idx) => (
                                    <TableRow key={idx} className="border-gray-100">
                                        <TableCell className="px-6 py-5"><Skeleton className="h-5 w-24 rounded" /></TableCell>
                                        <TableCell className="px-6 py-5"><Skeleton className="h-5 w-24 rounded" /></TableCell>
                                        <TableCell className="px-6 py-5"><Skeleton className="h-5 w-20 rounded" /></TableCell>
                                        <TableCell className="px-6 py-5 text-right"><Skeleton className="h-5 w-20 ml-auto rounded" /></TableCell>
                                        <TableCell className="px-6 py-5 text-right"><Skeleton className="h-5 w-20 ml-auto rounded" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                (orderRows || []).slice(0, 50).map((row) => (
                                    <TableRow key={row.order_id} className="group hover:bg-gray-50 transition-colors border-gray-100">
                                        <TableCell className="px-6 py-5 font-bold text-blue-700">{row.order_number}</TableCell>
                                        <TableCell className="px-6 py-5 font-semibold text-gray-700">{row.order_date}</TableCell>
                                        <TableCell className="px-6 py-5 font-semibold text-gray-700">{row.payment_status}</TableCell>
                                        <TableCell className="px-6 py-5 text-right font-semibold text-gray-700">₹ {Number(row.revenue || 0).toLocaleString()}</TableCell>
                                        <TableCell className="px-6 py-5 text-right font-black text-emerald-700">₹ {Number(row.profit || 0).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    );
}

