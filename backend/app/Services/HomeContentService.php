<?php

namespace App\Services;

/**
 * Public landing/home payload. Extend later with CMS or database-driven content.
 */
class HomeContentService
{
    /**
     * @return array<string, mixed>
     */
    public function getPublicHome(): array
    {
        return [
            'hero' => [
                'title' => config('app.name'),
                'subtitle' => 'AI-assisted floor planning and design workflows.',
            ],
            'stats' => [
                ['label' => 'Active projects', 'value' => '12k+'],
                ['label' => 'Design variations', 'value' => '480k+'],
                ['label' => 'Avg. time saved', 'value' => '38%'],
            ],
        ];
    }
}
