<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactFormRequest;
use App\Notifications\ContactFormSubmitted;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class ContactController extends Controller
{
    /**
     * Handle contact form submission
     */
    public function store(ContactFormRequest $request): RedirectResponse
    {
        try {
            $contactData = $request->validated();
            
            // Send email notification to michael@topshelf.life
            Notification::route('mail', 'michael@topshelf.life')
                ->notify(new ContactFormSubmitted($contactData));
            
            Log::info('Contact form submitted', [
                'name' => $contactData['name'],
                'email' => $contactData['email'],
                'subject' => $contactData['subject']
            ]);
            
            return redirect()->back()->with('success', 'Thank you for your message! We\'ll get back to you within 24 hours.');
            
        } catch (\Exception $e) {
            Log::error('Contact form submission error: ' . $e->getMessage());
            
            return redirect()->back()->with('error', 'There was an error sending your message. Please try again or contact us directly at michael@topshelf.life.');
        }
    }
}
