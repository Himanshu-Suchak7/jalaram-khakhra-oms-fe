import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import MainButton from "@/components/MainButton";

export default function ChangePassword({open, onOpenChange}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change a User&#39;s Password</DialogTitle>
                </DialogHeader>
                <div className={'space-y-8'}>
                    <div className={'space-y-2'}>
                        <Label htmlFor={'password'}>New Password</Label>
                        <Input type={'password'} placeholder={'Enter new password'}/>
                    </div>
                    <div className={'space-y-2'}>
                        <Label htmlFor={'password'}>Confirm Password</Label>
                        <Input type={'password'} placeholder={'Confirm new password'}/>
                    </div>
                </div>
                <DialogFooter>
                    <MainButton content={'Change Password'}/>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}