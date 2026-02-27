<?php
declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/use_cases/ports/gateways/contact_dispatch_gateway_port.php';

final class DmqContactDispatchChatwootGateway implements DmqContactDispatchGatewayPort
{
    public function dispatch(array $contactSubmission): array
    {
        $brandId = (string)($contactSubmission['brand_id'] ?? dmq_resolve_brand_id());
        $config = $this->resolveConfig($brandId);
        if (!$config['enabled']) {
            return ['ok' => true];
        }

        $email = trim((string)($contactSubmission['email'] ?? ''));
        $message = trim((string)($contactSubmission['message'] ?? ''));
        $name = trim((string)($contactSubmission['name'] ?? ''));
        if ($name === '') {
            $name = $email !== '' ? $email : 'Lead Landing';
        }

        $contact = $this->requestJson(
            'POST',
            $config['base_url'] . '/api/v1/accounts/' . rawurlencode($config['account_id']) . '/contacts',
            $config['api_token'],
            [
                'inbox_id' => (int)$config['inbox_id'],
                'name' => $name,
                'email' => $email,
                'identifier' => strtolower($brandId . ':' . $email),
                'custom_attributes' => [
                    'source' => 'landing_form',
                    'brand_id' => $brandId,
                    'request_id' => dmq_request_id(),
                ],
            ]
        );
        if (($contact['ok'] ?? false) !== true) {
            return $contact;
        }

        $contactId = (int)($contact['data']['id'] ?? 0);
        if ($contactId <= 0) {
            return [
                'ok' => false,
                'status' => 502,
                'code' => 'UPSTREAM_PROTOCOL_ERROR',
                'message' => 'Chatwoot response missing contact id.',
            ];
        }

        $conversation = $this->requestJson(
            'POST',
            $config['base_url'] . '/api/v1/accounts/' . rawurlencode($config['account_id']) . '/conversations',
            $config['api_token'],
            [
                'source_id' => (string)$contactId,
                'inbox_id' => (int)$config['inbox_id'],
                'contact_id' => $contactId,
                'status' => 'open',
            ]
        );
        if (($conversation['ok'] ?? false) !== true) {
            return $conversation;
        }

        $conversationId = (int)($conversation['data']['id'] ?? 0);
        if ($conversationId <= 0) {
            return [
                'ok' => false,
                'status' => 502,
                'code' => 'UPSTREAM_PROTOCOL_ERROR',
                'message' => 'Chatwoot response missing conversation id.',
            ];
        }

        return $this->requestJson(
            'POST',
            $config['base_url'] . '/api/v1/accounts/' . rawurlencode($config['account_id']) . '/conversations/' . $conversationId . '/messages',
            $config['api_token'],
            [
                'content' => $message,
                'message_type' => 'incoming',
            ]
        );
    }

    private function resolveConfig(string $brandId): array
    {
        $brandToken = strtoupper(preg_replace('/[^a-z0-9]+/i', '_', $brandId) ?? $brandId);
        $baseUrl = trim((string)getenv('CHATWOOT_' . $brandToken . '_BASE_URL'));
        $accountId = trim((string)getenv('CHATWOOT_' . $brandToken . '_ACCOUNT_ID'));
        $inboxId = trim((string)getenv('CHATWOOT_' . $brandToken . '_INBOX_ID'));
        $apiToken = trim((string)getenv('CHATWOOT_' . $brandToken . '_API_ACCESS_TOKEN'));

        $enabled = $baseUrl !== '' && $accountId !== '' && $inboxId !== '' && $apiToken !== '';
        return [
            'enabled' => $enabled,
            'base_url' => rtrim($baseUrl, '/'),
            'account_id' => $accountId,
            'inbox_id' => $inboxId,
            'api_token' => $apiToken,
        ];
    }

    private function requestJson(string $method, string $url, string $token, array $payload): array
    {
        if (!function_exists('curl_init')) {
            return [
                'ok' => false,
                'status' => 503,
                'code' => 'UPSTREAM_UNAVAILABLE',
                'message' => 'cURL extension not available.',
            ];
        }

        $ch = curl_init($url);
        if ($ch === false) {
            return [
                'ok' => false,
                'status' => 503,
                'code' => 'UPSTREAM_UNAVAILABLE',
                'message' => 'Failed to initialize upstream request.',
            ];
        }

        $body = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'api_access_token: ' . $token,
            ],
            CURLOPT_CONNECTTIMEOUT => 3,
            CURLOPT_TIMEOUT => 8,
        ]);

        $responseBody = curl_exec($ch);
        $curlError = curl_error($ch);
        $httpStatus = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($responseBody === false) {
            return [
                'ok' => false,
                'status' => 503,
                'code' => 'UPSTREAM_UNAVAILABLE',
                'message' => $curlError !== '' ? $curlError : 'Upstream request failed.',
            ];
        }

        $decoded = json_decode((string)$responseBody, true);
        $data = is_array($decoded) ? $decoded : [];
        if ($httpStatus < 200 || $httpStatus >= 300) {
            return [
                'ok' => false,
                'status' => $httpStatus > 0 ? $httpStatus : 502,
                'code' => 'UPSTREAM_ERROR',
                'message' => 'Chatwoot request failed.',
                'data' => $data,
            ];
        }

        return [
            'ok' => true,
            'status' => $httpStatus,
            'data' => $data,
        ];
    }
}
