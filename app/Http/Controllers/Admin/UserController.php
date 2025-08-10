<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserController extends Controller
{
    public function index(): Response
    {
        $this->authorize('view users');

        $users = User::with(['roles', 'permissions'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $roles = Role::all();
        $permissions = Permission::all()->groupBy(function ($permission) {
            $name = $permission->name;

            // Special handling for harmful content permissions
            if (str_contains($name, 'harmful content')) {
                return 'harmful_content';
            }

            // Group by second word for other permissions
            return explode(' ', $name)[1] ?? 'other';
        });

        // Get current user with roles and permissions
        $currentUser = Auth::user();
        $currentUser->load(['roles', 'permissions']);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'permissions' => $permissions,
            'auth' => [
                'user' => $currentUser,
            ],
        ]);
    }

    public function assignRole(Request $request, User $user)
    {
        $this->authorize('assign roles');

        $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        $user->syncRoles([$request->role]);

        return redirect()->route('admin.users.index')
            ->with('success', 'Role assigned successfully.');
    }

    public function assignPermissions(Request $request, User $user)
    {
        $this->authorize('assign permissions');

        $request->validate([
            'permissions' => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $permissions = $request->input('permissions', []);
        $user->syncPermissions($permissions);

        return redirect()->route('admin/users.index')
            ->with('success', 'Permissions assigned successfully.');
    }
}
