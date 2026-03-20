<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordEmail extends Mailable
{
    use Queueable, SerializesModels;

    public array $user;
    public string $resetLink;
    public object $template;

    public function __construct(array $user, string $resetLink, object $template)
    {
        $this->user = $user;
        $this->resetLink = $resetLink;
        $this->template = $template;
    }

    public function build(): self
    {
        return $this
            ->subject($this->template->subject)
            ->view('emails.thank_you') // Reusing layout
            ->with([
                'submission' => $this->user,
                'template'   => $this->template,
                'body'       => $this->renderBody(),
            ]);
    }

    private function renderBody(): string
    {
        $map = [
            '{{username}}'   => e($this->user['username']),
            '{{email}}'      => e($this->user['email']),
            '{{reset_link}}' => $this->resetLink,
        ];
        return str_replace(array_keys($map), array_values($map), $this->template->body_html);
    }
}
