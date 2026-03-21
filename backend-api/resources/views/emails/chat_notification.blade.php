<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
        .header { background: #007bff; color: white; padding: 15px; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        .message-box { background: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0; font-style: italic; }
        .footer { font-size: 12px; color: #888; text-align: center; margin-top: 20px; }
        .btn { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin:0;">Project Update: {{ $requestTitle }}</h2>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>You have received a new message regarding your active project request <strong>"{{ $requestTitle }}"</strong> from <strong>{{ $senderName }}</strong>.</p>
            
            <div class="message-box">
                "{{ $chatMessage }}"
            </div>

            <p>You can view and reply to this message directly in your dashboard.</p>
            
            <p style="text-align: center;">
                <a href="{{ config('app.url') }}/dashboard" class="btn">View Message in Dashboard</a>
            </p>
        </div>
        <div class="footer">
            Sent by CodeAxe Support System. Please do not reply to this email.
        </div>
    </div>
</body>
</html>
