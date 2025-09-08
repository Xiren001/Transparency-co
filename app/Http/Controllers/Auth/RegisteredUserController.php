<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(Request $request): Response
    {
        $googleUser = $request->session()->get('google_user');

        return Inertia::render('auth/register', [
            'googleUser' => $googleUser,
            'message' => $request->session()->get('message'),
            'messageType' => $request->session()->get('message_type'),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $googleUser = $request->session()->get('google_user');

        // Both Google and regular users need to set a password
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ];

        // Add Google data if this is a Google user
        if ($googleUser) {
            $userData['google_id'] = $googleUser['google_id'];
            $userData['google_token'] = $googleUser['google_token'];
            $userData['google_refresh_token'] = $googleUser['google_refresh_token'];
            $userData['email_verified_at'] = now(); // Google users are pre-verified
        }

        $user = User::create($userData);

        // Assign default 'user' role
        $user->assignRole('user');

        // If this is the very first user, assign admin role instead
        if (User::count() === 1) {
            $user->syncRoles('admin');
        }

        event(new Registered($user));

        Auth::login($user);

        // Clear Google user data from session
        $request->session()->forget('google_user');

        // Redirect based on role
        if ($user->hasRole(['admin', 'moderator', 'content_manager'])) {
            return redirect()->route('dashboard');
        }

        return redirect()->route('home');
    }
}
