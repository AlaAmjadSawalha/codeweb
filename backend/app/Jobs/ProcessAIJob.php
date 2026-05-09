<?php

namespace App\Jobs;

use App\Events\AIStatusUpdated;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessAIJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $projectId;

    public function __construct($projectId)
    {
        $this->projectId = $projectId;
    }

    public function handle(): void
    {
        $steps = [
            [
                'status' => 'Connecting...',
                'progress' => 10,
            ],
            [
                'status' => 'Analyzing prompt...',
                'progress' => 30,
            ],
            [
                'status' => 'Processing AI...',
                'progress' => 60,
            ],
            [
                'status' => 'Generating response...',
                'progress' => 90,
            ],
            [
                'status' => 'Done ✅',
                'progress' => 100,
            ],
        ];

        foreach ($steps as $step) {

            sleep(1);

            broadcast(new AIStatusUpdated(
                $step['status'],
                $this->projectId,
                $step['progress']
            ));
        }
    }
} 
