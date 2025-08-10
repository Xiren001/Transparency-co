import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Search, Shield, Users } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Users',
        href: '/admin/users',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    roles: Array<{
        id: number;
        name: string;
    }>;
    permissions: Array<{
        id: number;
        name: string;
    }>;
}

interface Role {
    id: number;
    name: string;
}

interface Permission {
    id: number;
    name: string;
}

interface PageProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    roles: Role[];
    permissions: Record<string, Permission[]>;
    auth: {
        user?: {
            roles?: Array<{ name: string }> | string[];
            permissions?: Array<{ name: string }> | string[];
        } | null;
    };
}

export default function UsersIndex() {
    const { users, roles, permissions, auth } = usePage().props as unknown as PageProps;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);

    // Helper function to check if current user has a specific permission
    const hasPermission = (permissionName: string): boolean => {
        if (!auth.user) return false;

        const userPermissions = auth.user.permissions;
        if (!userPermissions) return false;

        return userPermissions.some((permission: any) =>
            typeof permission === 'string' ? permission === permissionName : permission.name === permissionName,
        );
    };

    // Helper function to check if current user can assign roles
    const canAssignRoles = (): boolean => {
        return hasPermission('assign roles');
    };

    // Helper function to check if current user can assign permissions
    const canAssignPermissions = (): boolean => {
        return hasPermission('assign permissions');
    };

    // Helper function to check if current user can view users
    const canViewUsers = (): boolean => {
        return hasPermission('view users');
    };

    const roleForm = useForm({
        role: '',
    });

    const permissionForm = useForm({
        permissions: [] as string[],
    });

    const handleRoleChange = (user: User, newRole: string) => {
        setSelectedUser(user);
        setSelectedRole(newRole);
        setIsConfirmationOpen(true);
    };

    const handlePermissionClick = (user: User) => {
        setSelectedUser(user);
        permissionForm.setData(
            'permissions',
            user.permissions.map((p) => p.name),
        );
        setIsPermissionDialogOpen(true);
    };

    const confirmRoleAssignment = () => {
        if (selectedUser) {
            roleForm.setData('role', selectedRole);
            roleForm.post(route('admin.users.assign-role', selectedUser.id), {
                onSuccess: () => {
                    setIsConfirmationOpen(false);
                    setSelectedUser(null);
                    setSelectedRole('');
                    roleForm.reset();
                },
            });
        }
    };

    const confirmPermissionAssignment = () => {
        if (selectedUser) {
            permissionForm.post(route('admin.users.assign-permissions', selectedUser.id), {
                onSuccess: () => {
                    setIsPermissionDialogOpen(false);
                    setSelectedUser(null);
                    permissionForm.reset();
                },
            });
        }
    };

    const filteredUsers = users.data.filter(
        (user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const getRoleBadgeColor = (roleName: string) => {
        switch (roleName) {
            case 'admin':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'moderator':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'content_manager':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getCurrentRole = (user: User) => {
        return user.roles[0]?.name || 'user';
    };

    const getPermissionBadgeColor = (permissionName: string) => {
        if (permissionName.includes('delete')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        if (permissionName.includes('create')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        if (permissionName.includes('edit')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />

            <div className="flex min-h-screen w-full flex-col gap-8 bg-[#f7f8fa] p-2 sm:p-4 md:p-6 lg:p-8 xl:p-12 dark:bg-[#101014]">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Manage user roles and permissions</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Users ({users.total})
                        </CardTitle>
                        <CardDescription>View and manage user roles and permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Current Role</TableHead>
                                    <TableHead>Assign Role</TableHead>
                                    <TableHead>Permissions</TableHead>
                                    <TableHead>Manage Permissions</TableHead>
                                    <TableHead>Created</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge className={getRoleBadgeColor(getCurrentRole(user))}>
                                                {getCurrentRole(user).charAt(0).toUpperCase() + getCurrentRole(user).slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={getCurrentRole(user)}
                                                onValueChange={(value) => handleRoleChange(user, value)}
                                                disabled={!canAssignRoles()}
                                            >
                                                <SelectTrigger className="w-40">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map((role) => (
                                                        <SelectItem key={role.id} value={role.name}>
                                                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {user.permissions.slice(0, 3).map((permission) => (
                                                    <Badge key={permission.id} className={`text-xs ${getPermissionBadgeColor(permission.name)}`}>
                                                        {permission.name}
                                                    </Badge>
                                                ))}
                                                {user.permissions.length > 3 && (
                                                    <Badge className="bg-gray-100 text-xs text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                                                        +{user.permissions.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePermissionClick(user)}
                                                disabled={!canAssignPermissions()}
                                            >
                                                <Shield className="mr-2 h-4 w-4" />
                                                Manage
                                            </Button>
                                        </TableCell>
                                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Role Assignment Confirmation Dialog */}
                <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Role Assignment</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to assign the role "{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}" to{' '}
                                {selectedUser?.name}?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsConfirmationOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={confirmRoleAssignment} disabled={roleForm.processing || !canAssignRoles()}>
                                {roleForm.processing ? 'Assigning...' : 'Confirm Assignment'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Permission Assignment Dialog */}
                <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Manage Permissions for {selectedUser?.name}</DialogTitle>
                            <DialogDescription>Select the permissions you want to grant to this user.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Tabs defaultValue="users" className="w-full">
                                <TabsList className="grid w-full grid-cols-5">
                                    <TabsTrigger value="users">Users</TabsTrigger>
                                    <TabsTrigger value="products">Products</TabsTrigger>
                                    <TabsTrigger value="companies">Companies</TabsTrigger>
                                    <TabsTrigger value="harmful_content">Harmful Content</TabsTrigger>
                                    <TabsTrigger value="system">System</TabsTrigger>
                                </TabsList>

                                {Object.entries(permissions).map(([category, perms]) => (
                                    <TabsContent key={category} value={category} className="space-y-4">
                                        <div className="grid grid-cols-1 gap-3">
                                            {perms.map((permission) => (
                                                <div key={permission.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`permission-${permission.id}`}
                                                        checked={permissionForm.data.permissions.includes(permission.name)}
                                                        onCheckedChange={(checked) => {
                                                            const currentPermissions = permissionForm.data.permissions;
                                                            if (checked) {
                                                                permissionForm.setData('permissions', [...currentPermissions, permission.name]);
                                                            } else {
                                                                permissionForm.setData(
                                                                    'permissions',
                                                                    currentPermissions.filter((p) => p !== permission.name),
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor={`permission-${permission.id}`}
                                                        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        {permission.name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                ))}

                                {/* Special handling for harmful content permissions */}
                                {permissions.harmful_content && (
                                    <TabsContent value="harmful_content" className="space-y-4">
                                        <div className="grid grid-cols-1 gap-3">
                                            {permissions.harmful_content.map((permission) => (
                                                <div key={permission.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`permission-${permission.id}`}
                                                        checked={permissionForm.data.permissions.includes(permission.name)}
                                                        onCheckedChange={(checked) => {
                                                            const currentPermissions = permissionForm.data.permissions;
                                                            if (checked) {
                                                                permissionForm.setData('permissions', [...currentPermissions, permission.name]);
                                                            } else {
                                                                permissionForm.setData(
                                                                    'permissions',
                                                                    currentPermissions.filter((p) => p !== permission.name),
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor={`permission-${permission.id}`}
                                                        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        {permission.name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                )}
                            </Tabs>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={confirmPermissionAssignment} disabled={permissionForm.processing || !canAssignPermissions()}>
                                {permissionForm.processing ? 'Assigning...' : 'Assign Permissions'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
