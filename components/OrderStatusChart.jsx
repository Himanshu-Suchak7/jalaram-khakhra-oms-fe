'use client'
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Cell, Pie, PieChart, ResponsiveContainer} from "recharts";

export default function OrderStatusChart({data}) {
    const chartData = [
        {
            name: data.fulfilled.title,
            value: data.fulfilled.number,
            color: '#22c55e',
        },
        {
            name: data.pending.title,
            value: data.pending.number,
            color: '#3b82f6',
        },
        {
            name: data.canceled.title,
            value: data.canceled.number,
            color: '#ef4444',
        }
    ]
    return (
        <Card>
            <CardHeader className={'text-xl font-medium'}>{data.title}</CardHeader>
            <CardContent>
                <div className={'relative h-[300px]'}>
                    <ResponsiveContainer width={'100%'} height={'100%'}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                innerRadius={80}
                                outerRadius={110}
                                paddingAngle={3}
                                stroke={'none'}
                            >
                                {chartData.map((item, index) => (
                                    <Cell key={index} fill={item.color}/>
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold">{data.total}</span>
                        <span className="text-muted-foreground">
                        {data.totalTitle}
                    </span>
                    </div>
                </div>

                <div className="flex justify-between mt-4 text-sm">
                    <LegendItem
                        color="bg-green-500"
                        label={data.fulfilled.title}
                        value={data.fulfilled.number}
                    />
                    <LegendItem
                        color="bg-blue-500"
                        label={data.pending.title}
                        value={data.pending.number}
                    />
                    <LegendItem
                        color="bg-red-500"
                        label={data.canceled.title}
                        value={data.canceled.number}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

function LegendItem({color, label, value}) {
    return (
        <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${color}`}/>
            <span className="text-muted-foreground">
                {label} ({value})
            </span>
        </div>
    )
}