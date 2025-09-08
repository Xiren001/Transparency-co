<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from Google.
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            // Check if user already exists with this Google ID
            $user = User::where('google_id', $googleUser->id)->first();

            if ($user) {
                // User exists, log them in
                Auth::login($user);
            } else {
                // Check if user exists with the same email
                $existingUser = User::where('email', $googleUser->email)->first();

                if ($existingUser) {
                    // Update existing user with Google ID
                    $existingUser->update([
                        'google_id' => $googleUser->id,
                        'google_token' => $googleUser->token,
                        'google_refresh_token' => $googleUser->refreshToken,
                    ]);
                    Auth::login($existingUser);
                } else {
                    // No account exists - redirect to sign up with Google data
                    return redirect()->route('register')->with([
                        'google_user' => [
                            'name' => $googleUser->name,
                            'email' => $googleUser->email,
                            'google_id' => $googleUser->id,
                            'google_token' => $googleUser->token,
                            'google_refresh_token' => $googleUser->refreshToken,
                        ],
                        'message' => 'No account found with this Google account. Please complete your registration below.',
                        'message_type' => 'info'
                    ]);
                }
            }

            // Redirect based on user role
            $user = Auth::user();
            if ($user->hasRole(['admin', 'moderator', 'content_manager'])) {
                return redirect()->intended(route('dashboard'));
            } else {
                return redirect()->intended(route('home'));
            }
        } catch (\Exception $e) {
            // Handle any errors
            return redirect()->route('login')->with('error', 'Google authentication failed. Please try again.');
        }
    }
}
