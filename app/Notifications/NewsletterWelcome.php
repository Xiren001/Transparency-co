<?php

namespace App\Notifications;

use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewsletterWelcome extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(protected NewsletterSubscriber $subscriber) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        $verificationUrl = route('newsletter.verify', [
            'token' => $this->subscriber->verification_token,
        ]);

        $unsubscribeUrl = route('newsletter.unsubscribe', [
            'token' => $this->subscriber->verification_token,
        ]);

        return (new MailMessage)
            ->subject('Welcome to Our Newsletter!')
            ->view('emails.newsletter-welcome', [
                'subscriber' => $this->subscriber,
                'verificationUrl' => $verificationUrl,
                'unsubscribeUrl' => $unsubscribeUrl,
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
