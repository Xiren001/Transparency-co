<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Transparency Co Newsletter</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #007bff;
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header p {
            color: #666;
            margin: 10px 0 0 0;
            font-size: 16px;
        }
        .content {
            margin-bottom: 30px;
        }
        .content p {
            margin-bottom: 20px;
            font-size: 16px;
            line-height: 1.6;
        }
        .button {
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 25px 0;
            transition: transform 0.2s;
            box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
        }
        .benefits {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
            border-left: 4px solid #28a745;
        }
        .benefits h3 {
            color: #28a745;
            margin-top: 0;
            font-size: 18px;
        }
        .benefits ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .benefits li {
            margin-bottom: 8px;
            color: #555;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            font-size: 14px;
            color: #666;
            text-align: center;
        }
        .footer a {
            color: #007bff;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        .timestamp {
            font-size: 12px;
            color: #999;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Transparency Co!</h1>
            <p>Your journey towards ethical business practices starts here</p>
        </div>

        <div class="content">
            <p>Hello there! 👋</p>
            
            <p>Thank you for subscribing to the <strong>Transparency Co newsletter</strong>! We're thrilled to have you join our community of conscious consumers and ethical business advocates.</p>
            
            <div class="benefits">
                <h3>What you'll receive:</h3>
                <ul>
                    <li>🏷️ <strong>Exclusive deals</strong> and early access to promotions</li>
                    <li>🆕 <strong>New product announcements</strong> and transparency reports</li>
                    <li>📊 <strong>Industry insights</strong> on ethical business practices</li>
                    <li>🎯 <strong>Personalized recommendations</strong> for transparent brands</li>
                </ul>
            </div>
            
            <p>To ensure you receive our emails and unlock all these benefits, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
                <a href="{{ $verificationUrl }}" class="button">✓ Verify My Email Address</a>
            </div>
            
            <p><small>If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="{{ $verificationUrl }}" style="color: #007bff; word-break: break-all;">{{ $verificationUrl }}</a></small></p>
            
            <p>If you didn't request to subscribe to our newsletter, you can safely ignore this email or <a href="{{ $unsubscribeUrl }}" style="color: #dc3545;">unsubscribe here</a>.</p>
        </div>

        <div class="footer">
            <p><strong>Transparency Co</strong><br>
            Building a more transparent future, one business at a time.</p>
            
            <p>This email was sent to <strong>{{ $subscriber->email }}</strong><br>
            <a href="{{ $unsubscribeUrl }}">Unsubscribe</a> | <a href="mailto:michael@topshelf.life">Contact Us</a></p>
            
            <div class="timestamp">
                Sent on {{ now()->format('F j, Y \a\t g:i A T') }}
            </div>
        </div>
    </div>
</body>
</html> 