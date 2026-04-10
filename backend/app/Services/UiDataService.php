<?php

namespace App\Services;

/**
 * Optional dynamic chrome for navbar/footer. Safe to cache behind a CDN later.
 */
class UiDataService
{
    /**
     * @return array<string, mixed>
     */
    public function sharedChrome(): array
    {
        $frontend = rtrim((string) config('app.frontend_url'), '/');

        return [
            'navbar' => [
                'links' => [
                    ['label' => 'Features', 'href' => "{$frontend}/features"],
                    ['label' => 'Pricing', 'href' => "{$frontend}/pricing"],
                    ['label' => 'Gallery', 'href' => "{$frontend}/gallery"],
                ],
            ],
            'footer' => [
                'columns' => [
                    [
                        'title' => 'Product',
                        'links' => [
                            ['label' => 'Features', 'href' => "{$frontend}/features"],
                            ['label' => 'Pricing', 'href' => "{$frontend}/pricing"],
                        ],
                    ],
                    [
                        'title' => 'Company',
                        'links' => [
                            ['label' => 'About', 'href' => "{$frontend}/about"],
                            ['label' => 'Contact', 'href' => "{$frontend}/contact"],
                        ],
                    ],
                    [
                        'title' => 'Legal',
                        'links' => [
                            ['label' => 'Privacy', 'href' => "{$frontend}/privacy"],
                            ['label' => 'Terms', 'href' => "{$frontend}/terms"],
                        ],
                    ],
                ],
            ],
        ];
    }
}
