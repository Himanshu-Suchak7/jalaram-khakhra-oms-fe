"use client"
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {TrendingUp} from "lucide-react";
import {Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

export function RevenueGraph({data}) {
    const chartData = [
        {
            name: data.week1.title,
            revenue: data.week1.number
        },
        {
            name: data.week2.title,
            revenue: data.week2.number
        },
        {
            name: data.week3.title,
            revenue: data.week3.number
        },
        {
            name: data.week4.title,
            revenue: data.week4.number
        }
    ]
    return (
        <Card>
            <CardHeader className={'flex items-center justify-between'}>
                <div>
                    <h3 className={'text-xl font-medium'}>{data.title}</h3>
                    <p className={'text-sm text-gray-400'}>{`Last ${data.days} days`}</p>
                </div>
                <div className={'flex items-center gap-2 text-green-500'}>
                    <TrendingUp/>
                    <span className={'font-medium'}>+12.8%</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className={'relative h-[300px]'}>
                    <ResponsiveContainer width={'100%'} height={'100%'}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                interval={0}
                                padding={{left: 20, right: 20}}
                                axisLine={false}
                                tickLine={false}
                                tick={{fill: "#6b7280", fontSize: 12}}
                            />
                            <YAxis hide/>
                            <Tooltip
                                cursor={{stroke: "#e5e7eb", strokeDasharray: "4 4"}}
                                contentStyle={{
                                    borderRadius: "8px",
                                    border: "1px solid #e5e7eb",
                                }}
                            />

                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#3b82f6"
                                strokeWidth={4}
                                fill="url(#revenueGradient)"
                                dot={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}