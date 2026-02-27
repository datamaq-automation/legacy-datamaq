<?php
declare(strict_types=1);

function dmq_apply_security_headers(): void
{
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: no-referrer');
    header('X-Frame-Options: DENY');
}
