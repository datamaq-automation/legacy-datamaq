<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';
require_once __DIR__ . '/_resources.php';

dmq_handle_preflight();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'GET') {
    dmq_error_response(405, 'METHOD_NOT_ALLOWED', 'Method Not Allowed');
    exit;
}

dmq_json_response(200, dmq_resource_pricing([
    'diagnostico_lista_2h_ars' => 275000
]));
