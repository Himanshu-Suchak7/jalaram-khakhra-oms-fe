'use client';
import {Plus, Search, AlertCircle, Trash2} from "lucide-react";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHeader, TableRow, TableHead} from "@/components/ui/table";
import Image from "next/image";
import MainButton from "@/components/MainButton";
import {cn} from "@/lib/utils";
import UserActionMenu from "@/app/(dashboard)/users/_components/UserActionMenu";
import {useState, useMemo} from "react";
import AddUserPopUp from "@/app/(dashboard)/users/_components/AddUserPopUp";
import ChangePassword from "@/app/(dashboard)/users/_components/ChangePassword";
import {useAuth} from "@/lib/auth-context";
import {getUsers, updateUserRole, deleteUser} from "@/lib/user";
import {toast} from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const userTableHeader = ['User Name', 'PHONE NUMBER', 'USER ROLE', 'STATUS', 'ACTIONS']

export default function Users() {
    const {accessToken} = useAuth();
    const queryClient = useQueryClient();
    const [openAddUserModal, setOpenAddUserModal] = useState(false);
    const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const {
        data: users = [],
        isLoading: loading,
        refetch
    } = useQuery({
        queryKey: ['users', accessToken],
        queryFn: async () => {
            const data = await getUsers(accessToken);
            return Array.isArray(data) ? data : (data.users || []);
        },
        enabled: !!accessToken,
    });

    const roleMutation = useMutation({
        mutationFn: ({userId, role}) => updateUserRole(accessToken, userId, role),
        onSuccess: () => {
            toast.success("User role updated successfully");
            queryClient.invalidateQueries({queryKey: ["users"]});
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update role");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (userId) => deleteUser(accessToken, userId),
        onSuccess: () => {
            toast.success("User deleted successfully");
            setIsDeleteDialogOpen(false);
            setDeletingUserId(null);
            queryClient.invalidateQueries({queryKey: ["users"]});
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete user");
        }
    });

    const filteredUsers = useMemo(() => {
        if (!Array.isArray(users)) return [];
        return users.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone_number?.includes(searchQuery) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    const handleUpdateRole = (user, newRole) => {
        if (user.role === newRole) return;
        roleMutation.mutate({userId: user.id, role: newRole});
    };

    const handleChangePassword = (user) => {
        setSelectedUser(user);
        setOpenChangePasswordModal(true);
    };

    const requestDelete = (userId) => {
        setDeletingUserId(userId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (deletingUserId) {
            deleteMutation.mutate(deletingUserId);
        }
    };

    return (
        <div className="space-y-8">
            <div className={'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'}>
                <div className={'space-y-1'}>
                    <h1 className={'text-4xl font-bold font-heading'}>Team & Access</h1>
                    <p className={'text-gray-500 font-medium text-lg'}>Manage roles and permissions for your team members.</p>
                </div>
                <div className={'w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4'}>
                    <p className={'bg-blue-100 text-blue-700 font-bold rounded-full px-5 py-2.5 text-sm shadow-sm text-center tracking-wide'}>Administrator Controls</p>
                    <MainButton content={'Register New User'} Icon={Plus} onClick={() => setOpenAddUserModal(true)}/>
                </div>
            </div>

            <Card className={'overflow-hidden border-gray-100/60 shadow-sm rounded-2xl'}>
                <div className="p-6 space-y-6">
                    <div className={'w-full sm:max-w-md relative shadow-sm rounded-xl'}>
                        <Search className={'absolute left-4 top-[50%] -translate-y-1/2 h-5 w-5 text-muted-foreground'}/>
                        <Input 
                            className={'pl-12 h-14 rounded-xl text-lg border-gray-100 focus:border-blue-400 transition-all font-medium'} 
                            type={'text'} 
                            placeholder={'Search by name or phone...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="rounded-xl border border-gray-100 overflow-hidden">
                        <Table>
                            <TableHeader className={'bg-gray-50/50'}>
                                <TableRow className="hover:bg-transparent border-gray-100">
                                    {userTableHeader.map((header) => (
                                        <TableHead className={'px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider'} key={header}>
                                            {header}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <Skeleton className="h-14 w-14 rounded-full" />
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-5 w-32" />
                                                        <Skeleton className="h-4 w-24" />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5"><Skeleton className="h-5 w-28" /></TableCell>
                                            <TableCell className="px-6 py-5"><Skeleton className="h-7 w-20 rounded-full" /></TableCell>
                                            <TableCell className="px-6 py-5"><Skeleton className="h-7 w-20 rounded-full" /></TableCell>
                                            <TableCell className="px-6 py-5 text-right"><Skeleton className="h-10 w-10 ml-auto rounded-lg" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-40 text-center text-gray-500 font-medium">
                                            No users found matching your search.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id} className="group hover:bg-gray-50/50 border-gray-100 transition-colors">
                                            <TableCell className={'px-6 py-5'}>
                                                <div className="flex items-center gap-4">
                                                    <div className={'relative w-14 h-14 overflow-hidden rounded-full ring-4 ring-gray-50 shadow-sm border border-gray-100'}>
                                                        <Image 
                                                            src={user.profile_picture || "/jalaram-bapa-image.png"} 
                                                            fill 
                                                            className={'object-cover'}
                                                            alt={user.name}
                                                        />
                                                    </div>
                                                    <div className={'flex flex-col'}>
                                                        <span className={'text-xl font-bold text-gray-900'}>{user.name}</span>
                                                        <span className={'text-sm text-gray-500 font-medium'}>{user.email || 'No email provided'}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className={'px-6 py-5 font-bold text-gray-700 text-lg'}>{user.phone_number}</TableCell>
                                            <TableCell className={'px-6 py-5'}>
                                                <span className={cn('px-4 py-1.5 rounded-full text-xs font-bold tracking-wider inline-flex items-center',
                                                    user.role === 'admin' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-gray-100 text-gray-700 border border-gray-200',
                                                )}>
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                <span className={cn("px-4 py-1.5 rounded-full text-xs font-bold tracking-wider inline-flex items-center gap-2",
                                                    user.is_active ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                                                )}>
                                                    <span className={cn("w-2 h-2 rounded-full animate-pulse", user.is_active ? "bg-green-600" : "bg-red-600")}></span>
                                                    {user.is_active ? "ACTIVE" : "INACTIVE"}
                                                </span>
                                            </TableCell>
                                            <TableCell className={'px-6 py-5 text-right'}>
                                                <UserActionMenu 
                                                    user={user}
                                                    onChangePassword={handleChangePassword}
                                                    onUpdateRole={handleUpdateRole}
                                                    onDelete={requestDelete}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </Card>

            <AddUserPopUp open={openAddUserModal} onOpenChange={setOpenAddUserModal} onSuccess={refetch}/>
            
            <ChangePassword 
                open={openChangePasswordModal} 
                onOpenChange={setOpenChangePasswordModal}
                user={selectedUser}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl sm:text-3xl font-bold flex flex-col sm:flex-row sm:items-center gap-3 text-red-600">
                            <AlertCircle className="w-10 h-10" />
                            <span>Are you absolutely sure?</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xl text-gray-600 pt-3 font-medium">
                            This action cannot be undone. This will permanently delete the user account and revoke all their permissions immediately.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-4 pt-8">
                        <AlertDialogCancel className="rounded-2xl px-10 py-7 border-none bg-gray-50 text-xl font-bold hover:bg-gray-100 transition-all">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="rounded-2xl px-12 py-7 bg-red-600 hover:bg-red-700 text-white text-xl font-bold shadow-xl shadow-red-500/20 transition-all"
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Yes, Delete User Account"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
