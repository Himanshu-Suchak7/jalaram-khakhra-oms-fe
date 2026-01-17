import {Button} from "@/components/ui/button";

export default function MainButton({content, Icon, onClick}) {
    return (
        <Button onClick={onClick} className={'bg-blue-500 hover:bg-blue-700 px-6 py-4 font-medium cursor-pointer flex items-center gap-2'}>
            {Icon && <Icon size={18}/>}
            {content}
        </Button>
    )
}