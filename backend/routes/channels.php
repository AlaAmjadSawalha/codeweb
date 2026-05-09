<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('ai.{projectId}', function ($user, $projectId) {
    return true;
});