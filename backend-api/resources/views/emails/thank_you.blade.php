<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{ $template->subject }}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Email card -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);max-width:600px;width:100%;">

          <!-- Header bar -->
          <tr>
            <td style="background:{{ $template->brand_color }};padding:32px 40px;">
              @if($template->logo_url)
                <img src="{{ $template->logo_url }}" alt="CodeAxe" height="32" style="display:block;" />
              @else
                <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                  Code<span style="color:{{ $template->accent_color }};">Axe</span>
                </span>
              @endif
            </td>
          </tr>

          <!-- Accent line -->
          <tr>
            <td style="height:3px;background:{{ $template->accent_color }};"></td>
          </tr>

          <!-- Headline -->
          <tr>
            <td style="padding:40px 40px 16px;">
              <h1 style="margin:0;font-size:24px;font-weight:700;color:{{ $template->brand_color }};line-height:1.3;">
                {{ $template->headline }}
              </h1>
            </td>
          </tr>

          <!-- Body content -->
          <tr>
            <td style="padding:0 40px 32px;font-size:15px;line-height:1.7;color:#374151;">
              {!! $body !!}
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" />
            </td>
          </tr>

          <!-- CTA button -->
          <tr>
            <td style="padding:32px 40px;">
              <a href="https://codeaxe.co.in/work"
                 style="display:inline-block;background:{{ $template->accent_color }};color:#ffffff;text-decoration:none;padding:12px 28px;font-size:13px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;border-radius:2px;">
                View Our Work
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                {{ $template->footer_text }}
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#d1d5db;">
                CodeAxe Technologies &nbsp;·&nbsp;
                <a href="mailto:hello@codeaxe.co.in" style="color:{{ $template->accent_color }};text-decoration:none;">hello@codeaxe.co.in</a>
              </p>
            </td>
          </tr>

        </table>
        <!-- /Email card -->

      </td>
    </tr>
  </table>

</body>
</html>
