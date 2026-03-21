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

    /** Replace {{placeholders}} in body_html & sections with actual submission values */
    public function renderBody(): string
    {
        $map = [
            '{{name}}'    => e($this->submission['name']),
            '{{email}}'   => e($this->submission['email']),
            '{{company}}' => e($this->submission['company'] ?: 'N/A'),
            '{{message}}' => nl2br(e($this->submission['message'])),
        ];

        // 1. Render Base Body
        $fullBody = str_replace(array_keys($map), array_values($map), $this->template->body_html);

        // 2. Load and Append Sections
        $sections = \Illuminate\Support\Facades\DB::table('email_template_sections')
            ->where('template_id', $this->template->id)
            ->where('is_active', 1)
            ->orderBy('sort_order')
            ->get();

        foreach ($sections as $section) {
            $sectionContent = str_replace(array_keys($map), array_values($map), $section->content);
            $fullBody .= "\n\n" . $sectionContent;
        }

        return $fullBody;
    }
}
