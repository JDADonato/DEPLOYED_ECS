@include('emails.partials.brand-header', [
    'emailTitle' => 'Your Eloquente verification code',
    'headline' => 'Your verification code',
    'preheader' => "Use this code to continue your {$purpose}.",
])

<p style="margin:0 0 20px;">Use this code to continue your {{ $purpose }}. It expires in {{ $expiresInMinutes }} minutes.</p>

<div style="display:inline-block;border-radius:14px;background:#720101;color:#ffffff;font-size:30px;font-weight:900;letter-spacing:8px;padding:14px 18px;">
    {{ $otpCode }}
</div>

<p style="margin:22px 0 0;color:#64748b;font-size:13px;">If you did not request this code, you can safely ignore this email.</p>

@if(!empty($temporaryPassword))
    <div style="margin:20px 0;padding:16px;border-radius:12px;background:#fff7e8;border:1px solid #f0aa0b;">
        <p style="margin:0 0 8px;color:#9f6500;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:1px;">Your Temporary Password</p>
        <p style="margin:0;color:#720101;font-size:18px;font-weight:900;">{{ $temporaryPassword }}</p>
        <p style="margin:8px 0 0;color:#64748b;font-size:13px;">Use this password to log in. You will be prompted to change it immediately.</p>
    </div>
@endif

@include('emails.partials.brand-footer')
