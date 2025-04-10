<?php

namespace App\Jobs;

use App\Events\GAIAResponse;
use App\Events\GAIAStatus;
use App\Models\ExamFile;
use App\Models\Message;
use Gemini\Data\Content;
use Gemini\Enums\Role;
use Gemini\Laravel\Facades\Gemini;
use Illuminate\Cache\Lock;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ProcessMessageJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public ExamFile $exam_file, private string $lockKey, private string $lockOwner)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $exam_file_id = $this->exam_file->id;

        $messages = $this->exam_file->message()
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

        broadcast(new GAIAStatus($exam_file_id, "typing"));

        $model = Gemini::generativeModel('models/gemini-1.5-flash');
        $chat = $model->startChat(history: $history);
        $response = $chat->sendMessage("Pretend you are a teacher. keep it maximum 30 words.");
        $response_text = $response->text();

        $this->exam_file->message()->create([
            'sender_id' => null,
            'content' => $response_text,
            'is_gaia' => true,
        ]);


        broadcast(new GAIAResponse($exam_file_id, $response_text));
        broadcast(new GAIAStatus($exam_file_id, "responded"));

        Cache::restoreLock($this->lockKey, $this->lockOwner)->release();
    }
}
