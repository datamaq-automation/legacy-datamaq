<?php
declare(strict_types=1);

function dmq_gateway_contact_rate_limit(): array
{
    return dmq_service_enforce_bucket_rate_limit('contact', 5, 60);
}

