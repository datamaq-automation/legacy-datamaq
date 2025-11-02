<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Manejo de preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Simula un endpoint estático para pruebas frontend

// Lee el cuerpo de la petición
$body = file_get_contents('php://input');
$data = json_decode($body, true);

// Simula respuestas según los datos recibidos
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Método no permitido'
    ]);
    exit;
}

if (!isset($data['tipo']) || !isset($data['timestamp']) || !isset($data['seccion'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Datos incompletos o formato inválido'
    ]);
    exit;
}

// Simulación de duplicado (por ejemplo, si timestamp termina en "0")
if (substr($data['timestamp'], -1) === '0') {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'error' => 'Conversión duplicada detectada'
    ]);
    exit;
}

// Simulación de error interno (si seccion es "error")
if ($data['seccion'] === 'error') {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ocurrió un error técnico. Intenta nuevamente más tarde.'
    ]);
    exit;
}

// Respuesta exitosa
echo json_encode([
    'success' => true
]);