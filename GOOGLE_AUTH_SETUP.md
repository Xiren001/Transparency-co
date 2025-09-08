# Google OAuth Setup Instructions

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

## Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" > "OAuth 2.0 Client IDs"
6. Set the application type to "Web application"
7. Add the following authorized redirect URIs:
    - `http://localhost:8000/auth/google/callback` (for local development)
    - `https://yourdomain.com/auth/google/callback` (for production)
8. Copy the Client ID and Client Secret to your `.env` file

## Usage

The Google authentication is now available at:

- Login redirect: `/auth/google`
- Callback URL: `/auth/google/callback`

Users can now sign in with their Google accounts. The system will:

- **For existing users with Google ID**: Log them in directly
- **For existing users with matching email**: Link their Google account and log them in
- **For new users**: Redirect to registration page with pre-filled Google data and show a toast notification
- Assign the default 'user' role to new Google users
- Redirect admin users to the dashboard and regular users to the home page

## New User Flow

When a user tries to sign in with Google but doesn't have an account:

1. They are redirected to the registration page
2. A toast notification appears: "No account found with this Google account. Please complete your registration below."
3. The registration form is pre-filled with their Google name and email
4. Password fields are marked as optional with helpful text
5. A blue info box explains they can set a password for additional security or use only Google sign-in
6. After registration, they are logged in and redirected appropriately

## Features Implemented

- ✅ Laravel Socialite package installed
- ✅ Google OAuth configuration in `config/services.php`
- ✅ Database migration for Google auth fields
- ✅ User model updated with Google fields
- ✅ GoogleAuthController with redirect and callback methods
- ✅ Authentication routes added
- ✅ Automatic user creation and linking
- ✅ Role-based redirects after authentication
- ✅ Google login buttons added to login and register pages
- ✅ Frontend integration with React/Inertia.js

## Frontend Integration

The Google login buttons have been added to both the login and registration pages. The buttons:

- Use the official Google logo and styling
- Redirect to `/auth/google` when clicked
- Are styled consistently with the existing UI
- Include proper accessibility attributes

## Testing the Integration

1. Set up your Google OAuth credentials in the `.env` file
2. Visit the login page at `/login`
3. Click the "Continue with Google" button
4. Complete the Google OAuth flow
5. You should be redirected back to your application and logged in

The system will automatically:

- Create a new user if they don't exist
- Link existing users by email if they already have an account
- Assign the default 'user' role to new Google users
- Redirect admin users to the dashboard and regular users to the home page
