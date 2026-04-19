<?php

return [
    'secret' => env('JWT_SECRET'),
    'algo' => 'HS256',
    'ttl_seconds' => (int) env('JWT_TTL_SECONDS', 7 * 24 * 60 * 60),
];
