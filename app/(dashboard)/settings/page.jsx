import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import MainButton from "@/components/MainButton";

export default function Settings() {
    return (
        <>
            <div className={'space-y-2'}>
                <h1 className={'text-4xl font-bold'}>Settings</h1>
                <p className={'text-gray-400 text-lg'}>Manage your business and personal information and
                    preferences.</p>
            </div>
            <div>
                <Tabs defaultValue={'business-info'}>
                    <TabsList className={'max-w-1/3 w-full'}>
                        <TabsTrigger value={'business-info'} className={'cursor-pointer'}>Business
                            Information</TabsTrigger>
                        <TabsTrigger value={'personal-info'} className={'cursor-pointer'}>Personal
                            Information</TabsTrigger>
                    </TabsList>
                    <TabsContent value={'business-info'}>
                        <Card>
                            <CardHeader className={'border-b'}>
                                <CardTitle className={'text-2xl'}>
                                    Business Information
                                </CardTitle>
                                <CardDescription>Make sure your business information stays up to date.</CardDescription>
                            </CardHeader>
                            <CardContent className={'space-y-4'}>
                                <div className={'space-y-2'}>
                                    <Label htmlFor={'business-name'}>Business Name</Label>
                                    <Input type={'text'} id={'business-name'} name={'business-name'} required
                                           placeholder={'Enter your business name'}/>
                                </div>
                                <div className={'space-y-2'}>
                                    <Label htmlFor={'business-address'}>Address</Label>
                                    <Input type={'text'} id={'business-address'} name={'business-address'} required
                                           placeholder={'Enter your business address'}/>
                                </div>
                                <div className={'grid grid-cols-2 gap-6'}>
                                    <div className={'space-y-2'}>
                                        <Label htmlFor={'phone-number'}>Phone Number</Label>
                                        <Input type={'tel'} id={'phone-number'} name={'phone-number'} required
                                               placeholder={'Enter your phone number'}/>
                                    </div>
                                    <div className={'space-y-2'}>
                                        <Label htmlFor={'gst-number'}>GST Number (Optional)</Label>
                                        <Input type={'text'} id={'gst-number'} name={'gst-number'}
                                               placeholder={'Enter your gst number'}/>
                                    </div>
                                </div>
                                <div className={'space-y-2'}>
                                    <Label htmlFor={'upi-id'}>UPI ID</Label>
                                    <Input type={'text'} id={'upi-id'} name={'upi-id'} required
                                           placeholder={"Enter your UPI ID"}/>
                                </div>
                                <div className={'space-y-2'}>
                                    <Label htmlFor={'qr-code'}>UPI QR Code</Label>
                                    <Input type={'file'} id={'qr-code'} name={'qr-code'} accept={'image'}/>
                                </div>
                            </CardContent>
                            <CardFooter className={'border-t'}>
                                <MainButton content={'Save Changes'}/>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value={'personal-info'}>
                        <Card>
                            <CardHeader className={'border-b'}>
                                <CardTitle className={'text-2xl'}>
                                    Personal Information
                                </CardTitle>
                                <CardDescription>Make sure your personal information stays up to date.</CardDescription>
                            </CardHeader>
                            <CardContent className={'space-y-4'}>
                                <div className={'space-y-2'}>
                                    <Label htmlFor={'name'}>Name</Label>
                                    <Input type={'text'} id={'name'} name={'name'} required
                                           placeholder={'Enter your name'}/>
                                </div>
                                <div className={'grid grid-cols-2 gap-6'}>
                                    <div className={'space-y-2'}>
                                        <Label htmlFor={'phone-number'}>Phone Number</Label>
                                        <Input type={'tel'} id={'phone-number'} name={'phone-number'} required
                                               placeholder={'Enter your phone number'}/>
                                    </div>
                                    <div className={'space-y-2'}>
                                        <Label htmlFor={'email'}>Email Address (Optional)</Label>
                                        <Input type={'text'} id={'email'} name={'email'}
                                               placeholder={'Enter your Email Address'}/>
                                    </div>
                                </div>
                                <div className={'space-y-2'}>
                                    <Label htmlFor={'profile'}>Profile Picture</Label>
                                    <Input type={'file'} id={'profile'} name={'profile'} accept={'image'}/>
                                </div>
                            </CardContent>
                            <CardFooter className={'border-t'}>
                                <MainButton content={'Save Changes'}/>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}