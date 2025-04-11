<?php

namespace App\Jobs;

use App\Instructions\GAIAInstruct;
use App\Models\ExamFile;
use Gemini\Data\Content;
use Gemini\Enums\Role;
use Gemini\Laravel\Facades\Gemini;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProgressCheckJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(private int $exam_file_id)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $exam_file = ExamFile::find($this->exam_file_id);

        $messages = $exam_file->message()
            ->orderBy('created_at', 'desc')
            ->limit(25)
            ->get()
            ->reverse();


        $history = $messages->map(function ($message) {
            $role = null;
            $part = '';

            if (!$message->is_gaia) {
                $name = $message->sender->name;
                $part = "$name: " . $message->content;
                $role = Role::USER;
            } else {
                $part = $message->content;
                $role = Role::MODEL;
            }

            return Content::parse(part: $part, role: $role);
        })->all();

        
        $model = Gemini::generativeModel('models/gemini-1.5-flash');
        $chat = $model->startChat(history: $history);
        $response = $chat->sendMessage(GAIAInstruct::PROGRESS_INSTRUCTION);
        $progress_prompt = $response->text();

    }
}
