import {cn} from "@/lib/utils";

export default function StatusBadge({ status, type = "order" }) {
    if (!status) return null;

    const normalizedStatus = status.toUpperCase();
    
    const getStyles = () => {
        // Order Status Styles
        if (type === "order") {
            switch (normalizedStatus) {
                case 'FULFILLED': return 'bg-green-100 text-green-700 border-green-200';
                case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
                case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
                default: return 'bg-gray-100 text-gray-700 border-gray-200';
            }
        }

        // Payment Status Styles
        if (type === "payment") {
            switch (normalizedStatus) {
                case 'PAID': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
                case 'PARTIAL': return 'bg-orange-100 text-orange-700 border-orange-200';
                case 'UNPAID': return 'bg-rose-100 text-rose-700 border-rose-200';
                default: return 'bg-gray-100 text-gray-700 border-gray-200';
            }
        }

        // Inventory Status Styles
        if (type === "inventory") {
            switch (normalizedStatus) {
                case 'OK': return 'bg-green-50 text-green-700 border-green-100';
                case 'LOW_STOCK': return 'bg-orange-50 text-orange-700 border-orange-100';
                case 'OUT_OF_STOCK': return 'bg-red-50 text-red-700 border-red-100';
                default: return 'bg-gray-100 text-gray-700 border-gray-200';
            }
        }

        // User/General Status Styles
        if (type === "user") {
            switch (normalizedStatus) {
                case 'ACTIVE': return 'bg-green-50 text-green-700 border-green-100';
                case 'INACTIVE': return 'bg-red-50 text-red-700 border-red-100';
                default: return 'bg-gray-100 text-gray-700 border-gray-200';
            }
        }

        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getDotColor = () => {
        if (type === 'inventory' || type === 'user') {
            switch (normalizedStatus) {
                case 'OK':
                case 'ACTIVE': return 'bg-green-600';
                case 'LOW_STOCK': return 'bg-orange-600';
                case 'OUT_OF_STOCK':
                case 'INACTIVE': return 'bg-red-600';
                default: return 'bg-gray-400';
            }
        }
        return null;
    };

    const dotColor = getDotColor();

    return (
        <span className={cn(
            'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border inline-flex items-center',
            getStyles()
        )}>
            {dotColor && <span className={cn("w-1.5 h-1.5 rounded-full mr-2 animate-pulse", dotColor)}></span>}
            {status}
        </span>
    );
}
