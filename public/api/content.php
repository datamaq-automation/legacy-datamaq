<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'GET') {
    dmq_error_response(405, 'METHOD_NOT_ALLOWED', 'Method Not Allowed');
    exit;
}

$brandId = dmq_resolve_brand_id();
$content = dmq_build_app_content($brandId);

dmq_json_response(200, [
    'status' => 'ok',
    'request_id' => dmq_request_id(),
    'brand_id' => $brandId,
    'version' => 'v2',
    'data' => $content,
]);

function dmq_build_app_content(string $brandId): array
{
    $brandMap = [
        'datamaq' => [
            'brand' => 'DataMaq',
            'brand_aria_label' => 'DataMaq, inicio',
            'base_operativa' => 'Garin (GBA Norte)',
            'hero_title' => 'Diagnostico e instalacion electrica para cooperativas',
            'whatsapp_url' => 'https://wa.me/5491156297160'
        ],
        'upp' => [
            'brand' => 'UPP',
            'brand_aria_label' => 'UPP, inicio',
            'base_operativa' => 'Garin (GBA Norte)',
            'hero_title' => 'Diagnostico e instalacion electrica para pymes',
            'whatsapp_url' => 'https://wa.me/5491100000000'
        ],
        'example' => [
            'brand' => 'Marca Example',
            'brand_aria_label' => 'Marca Example, inicio',
            'base_operativa' => 'Base Operativa',
            'hero_title' => 'Diagnostico e instalacion electrica para pymes',
            'whatsapp_url' => 'https://wa.me/5491100000000'
        ],
    ];

    $selected = $brandMap[$brandId] ?? $brandMap['example'];
    $assetImage = [
        'src' => '/favicon.ico',
        'alt' => 'Imagen referencial',
        'width' => 256,
        'height' => 256
    ];

    return [
        'hero' => [
            'badge' => 'Servicio tecnico ' . $selected['brand'],
            'title' => $selected['hero_title'],
            'subtitle' => 'Levantamiento en campo, medicion y plan de accion con criterios operativos.',
            'responseNote' => 'Base operativa: ' . $selected['base_operativa'] . '. Valores de referencia: Consultar al WhatsApp.',
            'primaryCta' => [
                'label' => 'Escribir por WhatsApp',
                'href' => $selected['whatsapp_url'],
                'action' => 'whatsapp'
            ],
            'secondaryCta' => [
                'label' => 'Ver servicios',
                'href' => '#servicios',
                'action' => 'services'
            ],
            'benefits' => [
                ['title' => 'Diagnostico inicial', 'text' => 'Relevamiento tecnico y prioridades.', 'variant' => 'primary'],
                ['title' => 'Implementacion', 'text' => 'Ejecucion por etapas con trazabilidad.', 'variant' => 'success'],
                ['title' => 'Seguimiento', 'text' => 'Control de resultados y ajustes.', 'variant' => 'warning']
            ],
            'image' => $assetImage
        ],
        'services' => [
            'title' => 'Servicios',
            'cards' => [
                [
                    'id' => 'instalacion',
                    'title' => 'Instalacion y adecuacion',
                    'description' => 'Montaje, recambio y ordenamiento de tableros.',
                    'subtitle' => 'Estandarizacion tecnica',
                    'media' => $assetImage,
                    'items' => ['Tableros y protecciones', 'Cableado y etiquetado', 'Puesta en servicio'],
                    'figure' => array_merge($assetImage, ['caption' => 'Referencia comercial: Consultar al WhatsApp.']),
                    'cta' => ['label' => 'Consultar', 'href' => '#contacto', 'action' => 'contact', 'section' => 'contacto']
                ],
                [
                    'id' => 'medicion',
                    'title' => 'Medicion y diagnostico',
                    'description' => 'Medicion de consumo y deteccion de desbalances.',
                    'subtitle' => 'Instrumentacion: Powermeter',
                    'media' => $assetImage,
                    'items' => ['Perfil de carga', 'Eventos y anomalias', 'Informe accionable'],
                    'note' => 'Diagnostico en lista: Consultar al WhatsApp.',
                    'cta' => ['label' => 'Solicitar diagnostico', 'href' => '#contacto', 'action' => 'contact', 'section' => 'contacto']
                ],
                [
                    'id' => 'capacitacion',
                    'title' => 'Capacitacion operativa',
                    'description' => 'Transferencia de criterios para operacion diaria.',
                    'subtitle' => 'Procedimientos de campo',
                    'media' => $assetImage,
                    'items' => ['Rutinas de control', 'Lectura de indicadores', 'Buenas practicas'],
                    'cta' => ['label' => 'Coordinar', 'href' => '#contacto', 'action' => 'contact', 'section' => 'contacto']
                ]
            ]
        ],
        'about' => [
            'title' => 'Sobre ' . $selected['brand'],
            'paragraphs' => [
                'Trabajo orientado a continuidad operativa y decisiones tecnicas claras.',
                'Cada intervencion prioriza seguridad, orden documental y resultados medibles.'
            ],
            'image' => $assetImage
        ],
        'profile' => [
            'title' => 'Perfil tecnico',
            'bullets' => [
                'Diagnostico en sitio y plan de mejora.',
                'Implementacion por etapas.',
                'Acompanamiento posterior a la puesta en marcha.'
            ]
        ],
        'navbar' => [
            'brand' => $selected['brand'],
            'brandAriaLabel' => $selected['brand_aria_label'],
            'links' => [
                ['label' => 'Servicios', 'href' => '#servicios'],
                ['label' => 'Proceso', 'href' => '#proceso'],
                ['label' => 'Tarifas', 'href' => '#tarifas'],
                ['label' => 'Cobertura', 'href' => '#cobertura'],
                ['label' => 'FAQ', 'href' => '#faq'],
                ['label' => 'Contacto', 'href' => '#contacto']
            ],
            'contactLabel' => 'Contactar'
        ],
        'footer' => [
            'note' => $selected['brand'] . ' | ' . $selected['base_operativa']
        ],
        'legal' => [
            'text' => 'La informacion publicada es referencial y puede actualizarse sin previo aviso.'
        ],
        'contact' => [
            'title' => 'Contacto',
            'subtitle' => 'Contanos tu necesidad y te respondemos con un plan de accion.',
            'labels' => [
                'email' => 'Email',
                'message' => 'Mensaje'
            ],
            'submitLabel' => 'Enviar',
            'checkingMessage' => 'Verificando disponibilidad del backend...',
            'unavailableMessage' => 'Servicio temporalmente no disponible.',
            'successMessage' => 'Mensaje enviado. Gracias por contactarte.',
            'errorMessage' => 'No se pudo enviar. Intentalo nuevamente.',
            'unexpectedErrorMessage' => 'Ocurrio un error inesperado.'
        ],
        'consent' => [
            'title' => 'Privacidad',
            'description' => 'Usamos analitica para mejorar la experiencia.',
            'acceptLabel' => 'Aceptar',
            'rejectLabel' => 'Rechazar'
        ]
    ];
}
