import OrderForm from "@/app/(dashboard)/orders/_components/OrderForm";

export default function AddOrder() {
    return (
        <>
            <div className={'flex items-center'}>
                <div className={'space-y-2'}>
                    <h1 className={'text-4xl font-bold'}>Add New Order</h1>
                    <p className={'text-gray-400 text-lg'}>Please fill in the below details to create a new order.</p>
                </div>
            </div>
            <OrderForm mode={'add'}/>
        </>
    )
}