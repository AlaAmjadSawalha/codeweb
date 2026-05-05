<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Design extends Model
{
    protected $fillable = [
        'project_id',
        'title',
        'description',
        'image_url',
        'overall_score',
        'score_space',
        'score_lighting',
        'score_circulation',
        'score_budget',
        'score_functional',
        'cost_estimate',
        'is_saved',
        'is_selected',
        'metadata',
    ];

    protected $casts = [
        'cost_estimate' => 'array',
        'metadata'      => 'array',
        'is_saved'      => 'boolean',
        'is_selected'   => 'boolean',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
