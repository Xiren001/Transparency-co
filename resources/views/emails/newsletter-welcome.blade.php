<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Our Newsletter</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4a5568;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <h1>Welcome to Our Newsletter!</h1>
    
    <p>Thank you for subscribing to our newsletter. We're excited to share our latest updates, deals, and promotions with you.</p>
    
    <p>To ensure you receive our emails, please verify your email address by clicking the button below:</p>
    
    <a href="{{ $verificationUrl }}" class="button">Verify Email Address</a>
    
    <p>If you did not request to subscribe to our newsletter, you can safely ignore this email.</p>
    
    <div class="footer">
        <p>This email was sent to {{ $subscriber->email }}. If you wish to unsubscribe, please click <a href="{{ $unsubscribeUrl }}">here</a>.</p>
    </div>
</body>
</html> 