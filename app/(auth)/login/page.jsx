import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {LockKeyhole, NotebookTabs} from "lucide-react";
import Link from "next/link";

export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="max-w-[300px] sm:max-w-md p-4 sm:p-6 w-full">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">
                        Log In
                    </CardTitle>
                </CardHeader>
                <CardContent className={'px-0 sm:px-6 space-y-6'}>
                    <div>
                        <Label htmlFor={'phoneNumber'} className={'mb-2'}>Phone Number</Label>
                        <div className={'relative'}>
                            <NotebookTabs
                                className={'absolute left-3 top-[53%] -translate-y-1/2 h-4 w-4 text-muted-foreground'}/>
                            <Input className={'pl-9'} type={'tel'} id={'phoneNumber'} name={'phoneNumber'}
                                   placeholder={'Enter your phone number'} required/>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor={'password'} className={'mb-2'}>Password</Label>
                        <div className={'relative'}>
                            <LockKeyhole
                                className={'absolute left-3 top-[50%] -translate-y-1/2 h-4 w-4 text-muted-foreground'}/>
                            <Input className={'pl-9'} type={'password'} id={'password'} name={'password'}
                                   placeholder={'Enter your password'}
                                   required/>
                        </div>
                    </div>
                    <div>
                        <Link href={'/'}>
                            <Button className={'w-full bg-blue-500 hover:bg-blue-700 cursor-pointer'}>Log In</Button>
                        </Link>
                    </div>
                </CardContent>
                <CardFooter className={'justify-center'}>
                    <p className={'text-gray-400 text-sm'}>Made for Jalaram Khakhra</p>
                </CardFooter>
            </Card>
        </div>
    );
}
