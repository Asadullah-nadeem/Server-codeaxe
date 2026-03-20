<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerifyEmail extends Mailable
{
    use Queueable, SerializesModels;

    public array $user;
    public string $verificationLink;
    public object $template;

    public function __construct(array $user, string $verificationLink, object $template)
    {
        $this->user = $user;
        $this->verificationLink = $verificationLink;
        $this->template = $template;
    }

    public function build(): self
    {
        return $this
            ->subject($this->template->subject)
            ->view('emails.thank_you') // We can reuse the same layout template
            ->with([
                'submission' => $this->user, // not used directly in layout, but passed for compatibility
                'template'   => $this->template,
                'body'       => $this->renderBody(),
            ]);
    }

    private function renderBody(): string
    {
        $map = [
            '{{username}}'          => e($this->user['username']),
            '{{email}}'             => e($this->user['email']),
            '{{verification_link}}' => $this->verificationLink, // Note: not escaped intentionally to allow href
        ];
        return str_replace(array_keys($map), array_values($map), $this->template->body_html);
    }
}
