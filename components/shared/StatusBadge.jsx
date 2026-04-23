import {cn} from "@/lib/utils";

export default function StatusBadge({ status, type = "order" }) {
    if (!status) return null;

    const normalizedStatus = status.toUpperCase();
    
    const getStyles = () => {
        // Order Status Styles
        if (type === "order") {
            switch (normalizedStatus) {
                case 'FULFILLED': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30';
                case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30';
                case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30';
                default: return 'bg-muted text-foreground border-border';
            }
        }

        // Payment Status Styles
        if (type === "payment") {
            switch (normalizedStatus) {
                case 'PAID': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30';
                case 'PARTIAL': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30';
                case 'UNPAID': return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30';
                default: return 'bg-muted text-foreground border-border';
            }
        }

        // Inventory Status Styles
        if (type === "inventory") {
            switch (normalizedStatus) {
                case 'OK': return 'bg-green-50 text-green-700 border-green-100 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30';
                case 'LOW_STOCK': return 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30';
                case 'OUT_OF_STOCK': return 'bg-red-50 text-red-700 border-red-100 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30';
                default: return 'bg-muted text-foreground border-border';
            }
        }

        // User/General Status Styles
        if (type === "user") {
            switch (normalizedStatus) {
                case 'ACTIVE': return 'bg-green-50 text-green-700 border-green-100 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30';
                case 'INACTIVE': return 'bg-red-50 text-red-700 border-red-100 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30';
                default: return 'bg-muted text-foreground border-border';
            }
        }

        return 'bg-muted text-foreground border-border';
    };

    const getDotColor = () => {
        if (type === 'inventory' || type === 'user') {
            switch (normalizedStatus) {
                case 'OK':
                case 'ACTIVE': return 'bg-green-600 dark:bg-green-400';
                case 'LOW_STOCK': return 'bg-orange-600 dark:bg-orange-400';
                case 'OUT_OF_STOCK':
                case 'INACTIVE': return 'bg-red-600 dark:bg-red-400';
                default: return 'bg-muted-foreground';
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
