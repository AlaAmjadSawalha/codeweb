<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessAIJob;
use Illuminate\Http\Request;

class AIController extends Controller
{
    public function start($id)
    {
        // تشغيل الـ Job
        ProcessAIJob::dispatch($id);

        return response()->json([
            'message' => 'AI started',
            'project_id' => $id
        ]);
    }
}