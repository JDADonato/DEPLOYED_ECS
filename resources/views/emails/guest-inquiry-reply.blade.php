<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reply to your inquiry</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; border-top: 4px solid #720101;">
        <p style="margin-top: 0;">Hi {{ $inquiry->full_name }},</p>
        
        <div style="margin: 20px 0; padding: 20px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e5e7eb;">
            {!! nl2br(e($reply->message)) !!}
        </div>
        
        <p>Best regards,<br>
        {{ $staffName }}<br>
        <strong>Eloquente Catering Services</strong></p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <div style="color: #6b7280; font-size: 13px;">
            <p style="margin-bottom: 5px;"><strong>Your original message:</strong></p>
            <p style="margin-top: 0; padding-left: 10px; border-left: 3px solid #e5e7eb;">
                {!! nl2br(e($inquiry->message)) !!}
            </p>
        </div>
    </div>
</body>
</html>
