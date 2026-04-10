<?php

namespace App\Repositories;

use App\Models\Plan;
use Illuminate\Database\Eloquent\Collection;

class PlanRepository
{
    /**
     * @return Collection<int, Plan>
     */
    public function activeOrdered(): Collection
    {
        return Plan::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
    }
}
