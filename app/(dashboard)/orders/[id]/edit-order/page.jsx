import OrderForm from "@/app/(dashboard)/orders/_components/OrderForm";

export default function EditOrder(id) {
    return (
        <>
            <div className={'flex items-center'}>
                <div className={'space-y-2'}>
                    <h1 className={'text-4xl font-bold'}>Edit Order</h1>
                    <p className={'text-gray-400 text-lg'}>Please modify the below details to edit your order.</p>
                </div>
            </div>
            <OrderForm mode={'edit'}/>
        </>
    )
}