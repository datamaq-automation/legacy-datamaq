<?php
declare(strict_types=1);

function dmq_entity_contact_submission(array $payload): array
{
    return [
        'email' => trim((string)($payload['email'] ?? '')),
        'message' => trim((string)($payload['message'] ?? '')),
        'name' => trim((string)($payload['name'] ?? '')),
        'brand_id' => dmq_resolve_brand_id(),
    ];
}
