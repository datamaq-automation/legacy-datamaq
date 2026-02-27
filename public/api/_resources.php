<?php
declare(strict_types=1);

function dmq_resource_ok(array $data = []): array
{
    return array_merge([
        'status' => 'ok',
        'request_id' => dmq_request_id(),
    ], $data);
}

function dmq_resource_contact_accepted(): array
{
    return dmq_resource_ok();
}

function dmq_resource_health(string $service, string $brandId): array
{
    return dmq_resource_ok([
        'service' => $service,
        'brand_id' => $brandId,
        'version' => 'v1',
        'timestamp' => gmdate('c'),
    ]);
}

function dmq_resource_pricing(array $data): array
{
    return dmq_resource_ok([
        'version' => 'v1',
        'currency' => 'ARS',
        'data' => $data,
    ]);
}

function dmq_resource_content(string $brandId, array $content): array
{
    return dmq_resource_ok([
        'brand_id' => $brandId,
        'version' => 'v2',
        'data' => $content,
    ]);
}

function dmq_resource_quote(array $quote): array
{
    return array_merge([
        'request_id' => dmq_request_id(),
    ], $quote);
}

