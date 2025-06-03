<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use App\Notifications\NewsletterWelcome;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;

class NewsletterSubscriberController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|unique:newsletter_subscribers,email',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'The given data was invalid.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $subscriber = NewsletterSubscriber::create([
                'email' => $request->email,
                'is_active' => true,
                'verification_token' => Str::random(64),
                'subscribed_at' => now(),
            ]);

            // Send welcome email
            try {
                $subscriber->notify(new NewsletterWelcome($subscriber));
            } catch (\Exception $e) {
                // Log the email error but don't fail the subscription
                Log::error('Failed to send welcome email: ' . $e->getMessage());
            }

            return response()->json([
                'message' => 'Successfully subscribed to newsletter. Please check your email to verify your subscription.',
                'subscriber' => $subscriber,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Newsletter subscription error: ' . $e->getMessage());
            return response()->json([
                'message' => 'An error occurred while processing your subscription. Please try again later.',
            ], 500);
        }
    }

    public function verify($token)
    {
        $subscriber = NewsletterSubscriber::where('verification_token', $token)->first();

        if (!$subscriber) {
            return redirect()->route('home')->with('error', 'Invalid verification token.');
        }

        $subscriber->markEmailAsVerified();

        return redirect()->route('home')->with('success', 'Your email has been verified. Thank you for subscribing to our newsletter!');
    }

    public function unsubscribe($token)
    {
        $subscriber = NewsletterSubscriber::where('verification_token', $token)->first();

        if (!$subscriber) {
            return redirect()->route('home')->with('error', 'Invalid unsubscribe token.');
        }

        $subscriber->update(['is_active' => false]);

        return redirect()->route('home')->with('success', 'You have been unsubscribed from our newsletter.');
    }

    public function index()
    {
        $subscribers = NewsletterSubscriber::latest()->paginate(10);

        return Inertia::render('Newsletter/Index', [
            'subscribers' => $subscribers,
        ]);
    }

    public function export()
    {
        $subscribers = NewsletterSubscriber::where('is_active', true)
            ->whereNotNull('email_verified_at')
            ->get(['email', 'subscribed_at', 'email_verified_at']);

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="newsletter-subscribers.csv"',
        ];

        $callback = function () use ($subscribers) {
            $file = fopen('php://output', 'w');

            // Add headers
            fputcsv($file, ['Email', 'Subscribed At', 'Verified At']);

            // Add data
            foreach ($subscribers as $subscriber) {
                fputcsv($file, [
                    $subscriber->email,
                    $subscriber->subscribed_at->format('Y-m-d H:i:s'),
                    $subscriber->email_verified_at?->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
