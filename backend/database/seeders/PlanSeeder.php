<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Starter',
                'slug' => 'starter',
                'description' => 'For individuals exploring layout ideas.',
                'price_monthly' => 0,
                'price_yearly' => 0,
                'currency' => 'USD',
                'features' => [
                    '5 projects / month',
                    'Basic AI layout suggestions',
                    'Email support',
                ],
                'sort_order' => 10,
            ],
            [
                'name' => 'Pro',
                'slug' => 'pro',
                'description' => 'For professionals delivering client-ready concepts.',
                'price_monthly' => 29.00,
                'price_yearly' => 290.00,
                'currency' => 'USD',
                'features' => [
                    'Unlimited projects',
                    'Advanced comparisons',
                    'Priority support',
                ],
                'sort_order' => 20,
            ],
            [
                'name' => 'Studio',
                'slug' => 'studio',
                'description' => 'For teams that need shared workspaces.',
                'price_monthly' => 99.00,
                'price_yearly' => 990.00,
                'currency' => 'USD',
                'features' => [
                    'Team seats & roles',
                    'Shared asset library',
                    'Audit log (basic)',
                ],
                'sort_order' => 30,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::query()->updateOrCreate(
                ['slug' => $plan['slug']],
                $plan + ['is_active' => true],
            );
        }
    }
}
