<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewChatMessageMailable extends Mailable
{
    use Queueable, SerializesModels;

    public $chatMessage;
    public $senderName;
    public $requestTitle;
    public $isUser;

    public function __construct($chatMessage, $senderName, $requestTitle, $isUser = true)
    {
        $this->chatMessage = $chatMessage;
        $this->senderName = $senderName;
        $this->requestTitle = $requestTitle;
        $this->isUser = $isUser;
    }

    public function build()
    {
        $subject = ($this->isUser ? "[User Message] " : "[Support Reply] ") . "New update on project: " . $this->requestTitle;
        
        return $this->subject($subject)
                    ->view('emails.chat_notification');
    }
}
