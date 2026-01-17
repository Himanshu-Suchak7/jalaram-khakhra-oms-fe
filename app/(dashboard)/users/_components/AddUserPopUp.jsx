import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import MainButton from "@/components/MainButton";
import {Plus} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {DropdownMenu} from "@/components/ui/dropdown-menu";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export default function AddUserPopUp({open, onOpenChange}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a User</DialogTitle>
                </DialogHeader>
                <div className={'space-y-8'}>
                    <div className={'flex flex-col gap-4'}>
                        <div className={'space-y-2'}>
                            <Label htmlFor={'name'}>Name</Label>
                            <Input type={'text'} placeholder={'e.g. Enter Name of User'}/>
                        </div>
                        <div className={'space-y-2'}>
                            <Label htmlFor={'phone_number'}>Phone Number</Label>
                            <Input type={'text'} placeholder={'e.g. Enter Phone Number of User'}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">User Role</Label>
                            <Select>
                                <SelectTrigger className={'w-full'} id="role">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="USER">User</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className={'space-y-2'}>
                            <Label htmlFor={'password'}>Password</Label>
                            <Input type={'password'} placeholder={'Set a Password for that User'}/>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <MainButton content={'Add User'}/>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}