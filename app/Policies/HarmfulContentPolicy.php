<?php

namespace App\Policies;

use App\Models\User;
use App\Models\HarmfulContent;
use Illuminate\Auth\Access\HandlesAuthorization;

class HarmfulContentPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any harmful content.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view harmful content');
    }

    /**
     * Determine whether the user can view the harmful content.
     */
    public function view(User $user, HarmfulContent $harmfulContent): bool
    {
        return $user->can('view harmful content');
    }

    /**
     * Determine whether the user can create harmful content.
     */
    public function create(User $user): bool
    {
        return $user->can('create harmful content');
    }

    /**
     * Determine whether the user can update the harmful content.
     */
    public function update(User $user, HarmfulContent $harmfulContent): bool
    {
        return $user->can('edit harmful content');
    }

    /**
     * Determine whether the user can delete the harmful content.
     */
    public function delete(User $user, HarmfulContent $harmfulContent): bool
    {
        return $user->can('delete harmful content');
    }

    /**
     * Determine whether the user can manage harmful content status.
     */
    public function manageStatus(User $user, HarmfulContent $harmfulContent): bool
    {
        return $user->can('manage harmful content status');
    }

    /**
     * Determine whether the user can upload harmful content images.
     */
    public function uploadImages(User $user): bool
    {
        return $user->can('upload harmful content images');
    }
}
