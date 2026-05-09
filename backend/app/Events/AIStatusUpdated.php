<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AIStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $status;
    public $projectId;
    public $progress;

    public function __construct($status, $projectId, $progress = 0)
    {
        $this->status = $status;
        $this->projectId = $projectId;
        $this->progress = $progress;
    }

    /**
     * القناة اللي React رح يسمع عليها
     */
    public function broadcastOn()
    {
        return new Channel('ai.' . $this->projectId);
    }

    /**
     * اسم الحدث اللي React رح يستقبله
     */
    public function broadcastAs()
    {
        return 'ai.status.updated';
    }

    /**
     * البيانات اللي تنبعت للفرونت
     */
    public function broadcastWith()
    {
        return [
            'status' => $this->status,
            'project_id' => $this->projectId,
            'progress' => $this->progress,
        ];
    }
} 