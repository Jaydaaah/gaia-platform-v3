<?php

namespace App\Console\Commands;

use App\Models\Message;
use Illuminate\Console\Command;

class clearConvos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:clear-convos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Message::query()->delete();
        $this->info('All conversation messages have been cleared.');
    }
}
