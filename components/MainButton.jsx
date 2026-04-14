import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";

export default function MainButton({content, Icon, onClick, type = "button", loading = false, disabled = false}) {
    return (
        <Button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className="bg-blue-500 hover:bg-blue-700 px-6 py-4 font-medium cursor-pointer flex items-center gap-2"
        >
            {loading ? (
                <Loader2 className={'w-4 h-4 animate-spin'}/>
            ) : (Icon && <Icon size={18}/>)}
            {content}
        </Button>
    )
}