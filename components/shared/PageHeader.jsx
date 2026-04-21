import MainButton from "@/components/MainButton";

export default function PageHeader({ title, description, buttonContent, buttonIcon, onButtonClick, children }) {
    return (
        <div className={'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'}>
            <div className={'space-y-1'}>
                <h1 className={'text-4xl font-bold font-heading'}>{title}</h1>
                {description && <p className={'text-gray-500 font-medium text-lg'}>{description}</p>}
            </div>
            <div className={'w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4'}>
                {children}
                {buttonContent && (
                    <MainButton 
                        content={buttonContent} 
                        Icon={buttonIcon} 
                        onClick={onButtonClick} 
                    />
                )}
            </div>
        </div>
    );
}
