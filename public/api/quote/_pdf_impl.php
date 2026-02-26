<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/_bootstrap.php';

dmq_handle_preflight();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'GET') {
    dmq_error_response(405, 'METHOD_NOT_ALLOWED', 'Method Not Allowed');
    exit;
}

$quoteId = trim((string) ($_GET['quote_id'] ?? ''));
if ($quoteId === '') {
    dmq_error_response(422, 'VALIDATION_ERROR', 'quote_id is required.');
    exit;
}

if (!preg_match('/^Q-\d{8}-\d{6}$/', $quoteId)) {
    dmq_error_response(422, 'VALIDATION_ERROR', 'quote_id invalido');
    exit;
}

$pdfBytes = "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
    . "2 0 obj\n<< /Type /Pages /Count 1 /Kids [3 0 R] >>\nendobj\n"
    . "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] >>\nendobj\n"
    . "xref\n0 4\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \n"
    . "trailer\n<< /Root 1 0 R /Size 4 >>\nstartxref\n178\n%%EOF";

http_response_code(200);
dmq_apply_cors_headers();
dmq_apply_security_headers();
header('Content-Type: application/pdf');
header('Cache-Control: no-store');
header('Content-Disposition: attachment; filename="quote-' . $quoteId . '.pdf"');
header('X-Request-Id: ' . dmq_request_id());
echo $pdfBytes;
