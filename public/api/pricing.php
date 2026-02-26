<?php
declare(strict_types=1);

// public/api/pricing.php (minimal para pruebas)
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

echo json_encode([
    'ok' => true,
    'data' => [
        'diagnostico_lista_2h_ars' => 275000
    ]
], JSON_UNESCAPED_UNICODE);
