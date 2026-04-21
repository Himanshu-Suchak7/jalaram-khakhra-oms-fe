'use client'
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import MainButton from "@/components/MainButton";
import UpiQR from "@/app/(dashboard)/settings/_components/UpiQR";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {createBusinessSchema, updateProfileSchema} from "@/lib/validator/schema";
import {useAuth} from "@/lib/auth-context";
import {useEffect, useState} from "react";
import {createBusiness, getBusiness, updateBusiness} from "@/lib/business";
import {toast} from "sonner";
import ProfileAvatarUpload from "@/app/(dashboard)/settings/_components/ProfileAvatarUpload";
import {getCurrentUser, updateCurrentUser} from "@/lib/user";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function Settings() {
    const {accessToken, user} = useAuth();
    const queryClient = useQueryClient();
    const [isEdit, setIsEdit] = useState(false);
    const isAdmin = user?.role === "admin";

    const form = useForm({
        resolver: zodResolver(createBusinessSchema),
        mode: "onChange",
        shouldUnregister: false,
        defaultValues: {
            business_name: "",
            business_address: "",
            business_phone_number: "",
            business_email: "",
            gst_number: "",
            upi_id: "",
            upi_qr_image: "",
            tax_rate: 18.0,
            shipping_rate: 15.0,
        },
    });

    const personalInfoForm = useForm({
        resolver: zodResolver(updateProfileSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            phone_number: "",
            email: "",
            profile_picture: "",
        }
    })

    // Query for business details
    const businessQuery = useQuery({
        queryKey: ['business', accessToken],
        queryFn: () => getBusiness(accessToken),
        enabled: !!accessToken,
        retry: false, // Don't retry if business doesn't exist yet
    });

    // Query for user profile
    const userProfileQuery = useQuery({
        queryKey: ['userProfile', accessToken],
        queryFn: () => getCurrentUser(accessToken),
        enabled: !!accessToken,
    });

    // Update form when business data is loaded
    useEffect(() => {
        if (businessQuery.data) {
            form.reset({
                business_name: businessQuery.data.business_name,
                business_address: businessQuery.data.business_address,
                business_phone_number: businessQuery.data.business_phone_number,
                business_email: businessQuery.data.business_email || '',
                gst_number: businessQuery.data.gst_number || '',
                upi_id: businessQuery.data.upi_id,
                upi_qr_image: businessQuery.data.upi_qr_image,
                tax_rate: businessQuery.data.tax_rate,
                shipping_rate: businessQuery.data.shipping_rate,
            });
            setIsEdit(true);
        } else if (businessQuery.isError) {
            setIsEdit(false);
        }
    }, [businessQuery.data, businessQuery.isError, form]);

    // Update form when user profile data is loaded
    useEffect(() => {
        if (userProfileQuery.data) {
            personalInfoForm.reset({
                name: userProfileQuery.data.name,
                phone_number: userProfileQuery.data.phone_number,
                email: userProfileQuery.data.email || '',
                profile_picture: userProfileQuery.data.profile_picture || '',
            });
        }
    }, [userProfileQuery.data, personalInfoForm]);

    // Mutation for business update/create
    const businessMutation = useMutation({
        mutationFn: async (values) => {
            const formData = new FormData();
            formData.append("business_name", values.business_name);
            formData.append("business_address", values.business_address);
            formData.append("business_phone_number", values.business_phone_number);
            formData.append("upi_id", values.upi_id);
            if (values.business_email) {
                formData.append("business_email", values.business_email);
            }
            if (values.gst_number) {
                formData.append("gst_number", values.gst_number);
            }
            if (values.upi_qr_image instanceof File) {
                formData.append("upi_qr_image", values.upi_qr_image);
            }
            formData.append("tax_rate", values.tax_rate);
            formData.append("shipping_rate", values.shipping_rate);

            if (isEdit) {
                return updateBusiness(accessToken, formData);
            } else {
                return createBusiness(accessToken, formData);
            }
        },
        onSuccess: () => {
            toast.success(isEdit ? "Business updated successfully." : "Business Created successfully.");
            queryClient.invalidateQueries({ queryKey: ['business'] });
            setIsEdit(true);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    // Mutation for personal info update
    const profileMutation = useMutation({
        mutationFn: async (values) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("phone_number", values.phone_number);
            if (values.email) {
                formData.append("email", values.email);
            }
            if (values.profile_picture instanceof File) {
                formData.append("profile_picture", values.profile_picture);
            }
            return updateCurrentUser(accessToken, formData);
        },
        onSuccess: () => {
            toast.success("User Profile Updated successfully.");
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    async function onSubmit(values) {
        if (!isAdmin) {
            toast.error("Only admins can edit business information.");
            return;
        }
        businessMutation.mutate(values);
    }

    async function onProfileSubmit(values) {
        profileMutation.mutate(values);
    }

    if (businessQuery.isLoading || userProfileQuery.isLoading) {
        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-5 w-2/3" />
                </div>
                <Skeleton className="h-12 w-full rounded-xl" />
                <div className="rounded-xl border p-6 space-y-4">
                    <Skeleton className="h-6 w-56" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-12 w-40" />
                </div>
            </div>
        )
    }

    return (
        <>
            <div className={'space-y-2'}>
                <h1 className={'text-4xl font-bold'}>Settings</h1>
                <p className={'text-gray-400 text-lg'}>Manage your business and personal information and preferences.</p>
            </div>
            <div>
                <Tabs defaultValue={isAdmin ? 'business-info' : 'personal-info'}>
                    <TabsList className={'w-full grid grid-cols-2'}>
                        <TabsTrigger value={'business-info'} className={'cursor-pointer w-full'}>Business Information</TabsTrigger>
                        <TabsTrigger value={'personal-info'} className={'cursor-pointer w-full'}>Personal Information</TabsTrigger>
                    </TabsList>
                    <TabsContent value={'business-info'}>
                        <Card>
                            <CardHeader className={'border-b'}>
                                <CardTitle className={'text-2xl'}>Business Information</CardTitle>
                                <CardDescription>Make sure your business information stays up to date.</CardDescription>
                            </CardHeader>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <CardContent className={'space-y-4 pb-6'}>
                                    {!isAdmin && (
                                        <p className="text-sm text-amber-600 font-medium">
                                            You can view business information, but only admins can edit it.
                                        </p>
                                    )}
                                    <fieldset disabled={!isAdmin} className="space-y-4">
                                        <div className={'space-y-2'}>
                                            <Label htmlFor={'business-name'}>Business Name</Label>
                                            {form.formState.errors.business_name && (
                                                <p className={'text-xs text-red-600'}>{form.formState.errors.business_name.message}</p>
                                            )}
                                            <Input {...form.register("business_name")} placeholder={'Enter your business name'}/>
                                        </div>
                                        <div className={'space-y-2'}>
                                            <Label htmlFor={'business-address'}>Address</Label>
                                            {form.formState.errors.business_address && (
                                                <p className={'text-xs text-red-600'}>{form.formState.errors.business_address.message}</p>
                                            )}
                                            <Input {...form.register("business_address")} placeholder={'Enter your business address'}/>
                                        </div>
                                        <div className={'space-y-2'}>
                                            <Label htmlFor={'phone-number'}>Phone Number</Label>
                                            {form.formState.errors.business_phone_number && (
                                                <p className={'text-xs text-red-600'}>{form.formState.errors.business_phone_number.message}</p>
                                            )}
                                            <Input {...form.register("business_phone_number")} placeholder={'Enter your phone number'}/>
                                        </div>
                                        <div className={'grid grid-cols-1 md:grid-cols-2 gap-6'}>
                                            <div className={'space-y-2'}>
                                                <Label htmlFor={'email-address'}>Email Address (Optional)</Label>
                                                {form.formState.errors.business_email && (
                                                    <p className="text-xs text-red-600">{form.formState.errors.business_email.message}</p>
                                                )}
                                                <Input {...form.register("business_email")} placeholder={'Enter your email address'}/>
                                            </div>
                                            <div className={'space-y-2'}>
                                                <Label htmlFor={'gst-number'}>GST Number (Optional)</Label>
                                                {form.formState.errors.gst_number && (
                                                    <p className="text-xs text-red-600">{form.formState.errors.gst_number.message}</p>
                                                )}
                                                <Input {...form.register("gst_number")} placeholder={'Enter your gst number'}/>
                                            </div>
                                        </div>
                                        <div className={'space-y-2'}>
                                            <Label htmlFor={'upi-id'}>UPI ID</Label>
                                            {form.formState.errors.upi_id && (
                                                <p className="text-xs text-red-600">{form.formState.errors.upi_id.message}</p>
                                            )}
                                            <Input {...form.register("upi_id")} placeholder={"Enter your UPI ID"}/>
                                        </div>
                                        <div className={'grid grid-cols-1 md:grid-cols-2 gap-6'}>
                                            <div className={'space-y-2'}>
                                                <Label htmlFor={'tax-rate'}>Tax Rate (%)</Label>
                                                {form.formState.errors.tax_rate && (
                                                    <p className="text-xs text-red-600">{form.formState.errors.tax_rate.message}</p>
                                                )}
                                                <Select 
                                                    value={String(form.watch("tax_rate") || "")} 
                                                    onValueChange={(val) => form.setValue("tax_rate", Number(val))}
                                                    disabled={!isAdmin}
                                                >
                                                    <SelectTrigger className="h-11 w-full">
                                                        <SelectValue placeholder="Select Tax Rate" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from({ length: 100 }, (_, i) => i + 1).map(num => (
                                                            <SelectItem key={num} value={String(num)}>
                                                                {num}%
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className={'space-y-2'}>
                                                <Label htmlFor={'shipping-rate'}>Shipping Rate (%)</Label>
                                                {form.formState.errors.shipping_rate && (
                                                    <p className="text-xs text-red-600">{form.formState.errors.shipping_rate.message}</p>
                                                )}
                                                <Select 
                                                    value={String(form.watch("shipping_rate") || "")} 
                                                    onValueChange={(val) => form.setValue("shipping_rate", Number(val))}
                                                    disabled={!isAdmin}
                                                >
                                                    <SelectTrigger className="h-11 w-full">
                                                        <SelectValue placeholder="Select Shipping Rate" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from({ length: 100 }, (_, i) => i + 1).map(num => (
                                                            <SelectItem key={num} value={String(num)}>
                                                                {num}%
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        {form.formState.errors.upi_qr_image && (
                                            <p className={'text-xs text-red-600'}>{form.formState.errors.upi_qr_image.message}</p>
                                        )}
                                        <UpiQR label={'Upload UPI QR Code'} value={form.watch('upi_qr_image')} disabled={!isAdmin} onChange={(file) => form.setValue("upi_qr_image", file)}/>
                                    </fieldset>
                                </CardContent>
                                <CardFooter className={'border-t'}>
                                    <MainButton type={"submit"} loading={businessMutation.isPending} disabled={!isAdmin || businessMutation.isPending} content={isEdit ? "Update Business" : "Save Business"}/>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                    <TabsContent value={'personal-info'}>
                        <Card>
                            <CardHeader className={'border-b'}>
                                <CardTitle className={'text-2xl'}>Personal Information</CardTitle>
                                <CardDescription>Make sure your personal information stays up to date.</CardDescription>
                            </CardHeader>
                            <form onSubmit={personalInfoForm.handleSubmit(onProfileSubmit)}>
                                <CardContent className={'space-y-4'}>
                                    {personalInfoForm.formState.errors.profile_picture && (
                                        <p className={'text-xs text-red-600'}>{personalInfoForm.formState.errors.profile_picture.message}</p>
                                    )}
                                    <ProfileAvatarUpload label={'Upload profile picture'} value={personalInfoForm.watch('profile_picture')} onChange={(file) => personalInfoForm.setValue("profile_picture", file)}/>
                                    <div className={'space-y-2'}>
                                        <Label htmlFor={'name'}>Name</Label>
                                        {personalInfoForm.formState.errors.name && (
                                            <p className="text-xs text-red-600">{personalInfoForm.formState.errors.name.message}</p>
                                        )}
                                        <Input {...personalInfoForm.register("name")} placeholder={'Enter your name'}/>
                                    </div>
                                    <div className={'grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'}>
                                        <div className={'space-y-2'}>
                                            <Label htmlFor={'phone-number'}>Phone Number</Label>
                                            {personalInfoForm.formState.errors.phone_number && (
                                                <p className={'text-xs text-red-600'}>{personalInfoForm.formState.errors.phone_number.message}</p>
                                            )}
                                            <Input {...personalInfoForm.register("phone_number")} placeholder={'Enter your phone number'}/>
                                        </div>
                                        <div className={'space-y-2'}>
                                            <Label htmlFor={'email'}>Email Address (Optional)</Label>
                                            {personalInfoForm.formState.errors.email && (
                                                <p className="text-xs text-red-600">{personalInfoForm.formState.errors.email.message}</p>
                                            )}
                                            <Input {...personalInfoForm.register("email")} placeholder={'Enter your Email Address'}/>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className={'border-t'}>
                                    <MainButton type={'submit'} loading={profileMutation.isPending} content={'Save Changes'}/>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}
