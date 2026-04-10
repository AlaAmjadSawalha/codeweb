<?php

namespace App\Services;

use App\Repositories\PlanRepository;
use Illuminate\Database\Eloquent\Collection;

class PricingService
{
    public function __construct(
        private readonly PlanRepository $plans,
    ) {}

    /**
     * @return Collection<int, \App\Models\Plan>
     */
    public function listActivePlans(): Collection
    {
        return $this->plans->activeOrdered();
    }
}
