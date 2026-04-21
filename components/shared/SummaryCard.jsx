import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";

export default function SummaryCard({ title, value, icon: Icon, iconColor, isLoading }) {
    if (isLoading) {
        return (
            <Card className="border-gray-100/60 shadow-sm">
                <CardHeader className={'flex flex-row items-center justify-between pb-2'}>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-5 rounded" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-16" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-gray-100/60 shadow-sm hover:shadow-md transition-shadow group">
            <CardHeader className={'flex flex-row items-center justify-between pb-2'}>
                <CardTitle className={'text-lg font-bold text-gray-600 group-hover:text-blue-600 transition-colors'}>{title}</CardTitle>
                <Icon className={`${iconColor} w-6 h-6 group-hover:scale-110 transition-transform`}/>
            </CardHeader>
            <CardContent>
                <p className={'text-3xl font-bold text-gray-900'}>{value}</p>
            </CardContent>
        </Card>
    );
}
