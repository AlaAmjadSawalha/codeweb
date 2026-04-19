<?php

namespace Database\Seeders;

use App\Models\PasswordResetToken;
use App\Models\Project;
use App\Models\ProjectPreference;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ModuleDemoSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->where('email', 'admin@example.com')->first();
        $user = User::query()->where('email', 'test@example.com')->first();

        if ($admin !== null) {
            $admin->forceFill(['plan' => 'enterprise'])->save();
        }

        if ($user === null) {
            return;
        }

        $user->forceFill(['plan' => 'free'])->save();

        Project::query()->where('user_id', $user->id)->delete();

        $p1 = Project::query()->create([
            'user_id' => $user->id,
            'name' => 'Downtown Loft',
            'mode' => 'residential',
            'status' => 'active',
        ]);

        $p2 = Project::query()->create([
            'user_id' => $user->id,
            'name' => 'Retail Showroom',
            'mode' => 'commercial',
            'status' => 'active',
        ]);

        $p3 = Project::query()->create([
            'user_id' => $user->id,
            'name' => 'HQ Office',
            'mode' => 'office',
            'status' => 'draft',
        ]);

        ProjectPreference::query()->create([
            'project_id' => $p1->id,
            'budget' => 45000.00,
            'style' => 'Modern',
            'colors' => ['#1e293b', '#0ea5e9', '#f8fafc'],
            'usage' => 'Living + workspace',
            'furniture' => true,
        ]);

        ProjectPreference::query()->create([
            'project_id' => $p2->id,
            'budget' => 120000.50,
            'style' => 'Industrial',
            'colors' => ['#111827', '#f97316'],
            'usage' => 'Retail display',
            'furniture' => false,
        ]);

        PasswordResetToken::query()->create([
            'user_id' => $user->id,
            'token' => 'expired-demo-token-'.bin2hex(random_bytes(8)),
            'expires_at' => Carbon::now()->subHour(),
            'used' => false,
        ]);
    }
}
