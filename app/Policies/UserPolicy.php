<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('view users');
    }

    public function view(User $user, User $model): bool
    {
        return $user->can('view users');
    }

    public function create(User $user): bool
    {
        return $user->can('create users');
    }

    public function update(User $user, User $model): bool
    {
        return $user->can('edit users');
    }

    public function delete(User $user, User $model): bool
    {
        return $user->can('delete users');
    }

    public function assignRoles(User $user): bool
    {
        return $user->can('assign roles');
    }

    public function assignPermissions(User $user): bool
    {
        return $user->can('assign permissions');
    }
}
