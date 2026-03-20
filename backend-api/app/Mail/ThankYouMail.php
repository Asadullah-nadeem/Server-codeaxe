<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ThankYouMail extends Mailable
{
    use Queueable, SerializesModels;

    public array $submission;
    public object $template;

    public function __construct(array $submission, object $template)
    {
        $this->submission = $submission;
        $this->template   = $template;
    }

    public function build(): self
    {
        return $this
            ->subject($this->template->subject)
            ->view('emails.thank_you')
            ->with([
                'submission' => $this->submission,
                'template'   => $this->template,
                'body'       => $this->renderBody(),
            ]);
    }

    /** Replace {{placeholders}} in body_html with actual submission values */
    private function renderBody(): string
    {
        $map = [
            '{{name}}'    => e($this->submission['name']),
            '{{email}}'   => e($this->submission['email']),
            '{{company}}' => e($this->submission['company'] ?: 'N/A'),
            '{{message}}' => nl2br(e($this->submission['message'])),
        ];
        return str_replace(array_keys($map), array_values($map), $this->template->body_html);
    }
}
