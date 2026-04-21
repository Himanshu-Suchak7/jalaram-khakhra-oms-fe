"use client";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Eye, EyeOff, LockKeyhole, NotebookTabs} from "lucide-react";
import {useState} from "react";
import {useAuth} from "@/lib/auth-context";
import {useRouter} from "next/navigation";
import {login} from "@/lib/auth";
import {toast} from "sonner";
import { Spinner } from "@/components/ui/spinner";


export default function Login() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loggingIn, setLoggingIn] = useState(false);
    const {setAccessToken} = useAuth();
    const router = useRouter();

    async function handleLogin(e) {
        e?.preventDefault?.();
        if (loggingIn) return;

        setLoggingIn(true);
        try {
            const data = await login(phone, password);
            setAccessToken(data.access_token);
            router.push("/");
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoggingIn(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="max-w-[300px] sm:max-w-md p-4 sm:p-6 w-full">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">
                        Log In
                    </CardTitle>
                </CardHeader>
                <CardContent className={'px-0 sm:px-6'}>
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <Label htmlFor={'phoneNumber'} className={'mb-2'}>Phone Number</Label>
                            <div className={'relative'}>
                                <NotebookTabs
                                    className={'absolute left-3 top-[53%] -translate-y-1/2 h-4 w-4 text-muted-foreground'}/>
                                <Input
                                    className={'pl-9'}
                                    type={'tel'}
                                    id={'phoneNumber'}
                                    name={'phoneNumber'}
                                    placeholder={'Enter your phone number'}
                                    required
                                    autoComplete="tel"
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor={'password'} className={'mb-2'}>Password</Label>
                            <div className={'relative'}>
                                <LockKeyhole
                                    className={'absolute left-3 top-[50%] -translate-y-1/2 h-4 w-4 text-muted-foreground'}/>
                                <Input
                                    className={'pl-9 pr-10'}
                                    type={showPassword ? "text" : "password"}
                                    id={'password'}
                                    name={'password'}
                                    placeholder={'Enter your password'}
                                    required
                                    autoComplete="current-password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    onClick={() => setShowPassword((s) => !s)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <Button
                                type="submit"
                                disabled={loggingIn}
                                className={'w-full bg-blue-500 hover:bg-blue-700 cursor-pointer'}
                            >
                                {loggingIn ? (
                                    <span className="inline-flex items-center justify-center gap-2">
                                        <Spinner className="h-4 w-4" />
                                        Logging in...
                                    </span>
                                ) : (
                                    "Log In"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className={'justify-center'}>
                    <p className={'text-gray-400 text-sm'}>Made for Jalaram Khakhra</p>
                </CardFooter>
            </Card>
        </div>
    );
}
