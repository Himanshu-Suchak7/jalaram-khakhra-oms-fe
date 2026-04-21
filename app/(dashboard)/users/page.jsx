'use client';
import {Plus, Search, Trash2} from "lucide-react";
import {cn} from "@/lib/utils";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHeader, TableRow, TableHead} from "@/components/ui/table";
import Image from "next/image";
import {useState, useMemo} from "react";
import AddUserPopUp from "@/app/(dashboard)/users/_components/AddUserPopUp";
import ChangePassword from "@/app/(dashboard)/users/_components/ChangePassword";
import UserActionMenu from "@/app/(dashboard)/users/_components/UserActionMenu";
import {useAuth} from "@/lib/auth-context";
import {getUsers, updateUserRole, deleteUser} from "@/lib/user";
import {toast} from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";

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
            <PageHeader 
                title="Team & Access" 
                description="Manage roles, permissions, and security for your team members."
                buttonContent="Register New User"
                buttonIcon={Plus}
                onButtonClick={() => setOpenAddUserModal(true)}
            >
                <div className="hidden lg:block bg-blue-50 text-blue-700 font-bold px-5 py-2.5 rounded-xl text-sm border border-blue-100">
                    Administrator Controls
                </div>
            </PageHeader>

            <Card className={'overflow-hidden border-gray-100/60 shadow-sm rounded-2xl bg-white'}>
                <div className="p-6">
                    <div className={'w-full sm:max-w-md relative'}>
                        <Search className={'absolute left-4 top-[50%] -translate-y-1/2 h-5 w-5 text-muted-foreground'}/>
                        <Input 
                            className={'pl-12 h-14 rounded-xl text-lg border-gray-100 focus:border-blue-400 shadow-sm font-medium transition-all'} 
                            placeholder={'Search team members...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="border-t border-gray-100">
                    <Table>
                        <TableHeader className={'bg-gray-50/50'}>
                            <TableRow className="hover:bg-transparent border-gray-100">
                                {userTableHeader.map((header) => (
                                    <TableHead className={cn(
                                        'px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider',
                                        header === 'ACTIONS' && 'text-right'
                                    )} key={header}>
                                        {header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <TableRow key={idx} className="border-gray-100">
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
                                    <TableCell colSpan={5} className="h-60 text-center text-gray-400 font-bold text-lg">
                                        No team members match your criteria.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id} className="group hover:bg-gray-50/50 border-gray-100 transition-colors">
                                        <TableCell className={'px-6 py-5'}>
                                            <div className="flex items-center gap-4">
                                                <div className={'relative w-14 h-14 overflow-hidden rounded-full ring-4 ring-gray-50 shadow-sm border border-gray-100 bg-white'}>
                                                    <Image 
                                                        src={user.profile_picture || "/jalaram-bapa-image.png"} 
                                                        fill 
                                                        className={'object-cover'}
                                                        alt={user.name}
                                                    />
                                                </div>
                                                <div className={'flex flex-col'}>
                                                    <span className={'text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors'}>{user.name}</span>
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
                                            <StatusBadge status={user.is_active ? "ACTIVE" : "INACTIVE"} type="user" />
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
            </Card>

            <AddUserPopUp open={openAddUserModal} onOpenChange={setOpenAddUserModal} onSuccess={refetch}/>
            
            <ChangePassword 
                open={openChangePasswordModal} 
                onOpenChange={setOpenChangePasswordModal}
                user={selectedUser}
            />

            <ConfirmationDialog 
                open={isDeleteDialogOpen} 
                onOpenChange={setIsDeleteDialogOpen} 
                onConfirm={confirmDelete}
                isPending={deleteMutation.isPending}
                confirmText="Yes, Terminate Access"
                title="Revoke Team Access?"
                description="This will immediately revoke all access permissions for this user. This action is critical and will be logged in the system audit."
            />
        </div>
    )
}
