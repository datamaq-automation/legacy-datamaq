<?php
/**
 * Blocksy Child Datamaq functions and definitions
 */

define('DM_THEME_URL', 'https://datamaq.com.ar/wp-content/themes/blocksy-child-datamaq');

/**
 * Enqueue parent and child styles.
 */
add_action( 'wp_enqueue_scripts', 'blocksy_child_enqueue_styles', 999 );
function blocksy_child_enqueue_styles() {
	wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );
    wp_enqueue_style( 'child-style', get_stylesheet_uri(), array('parent-style'), '1.7.0' );
    wp_enqueue_style( 'tailwind-styles', DM_THEME_URL . '/assets/css/tailwind-dist.css', array(), '1.7.0' );
    
    if ( class_exists( 'LearnPress' ) ) {
        wp_enqueue_style( 'learnpress-overrides', DM_THEME_URL . '/assets/css/learnpress-overrides.css', array(), '1.3.0' );
    }
}

/**
 * Navigation JS Injected in Footer (Simplified for Bulletproof)
 */
add_action('wp_footer', 'blocksy_child_nav_script', 999);
function blocksy_child_nav_script() {
    ?>
    <script>
    (function() {
        const toggle = document.getElementById('mobile-menu-toggle');
        const close = document.getElementById('mobile-menu-close');
        const canvas = document.getElementById('mobile-offcanvas');
        const overlay = document.getElementById('offcanvas-overlay');
        
        if (!toggle || !canvas) return;

        toggle.onclick = function() {
            canvas.style.display = 'block';
            canvas.classList.add('is-active');
            document.body.style.overflow = 'hidden';
        };

        const hide = function() {
            canvas.style.display = 'none';
            canvas.classList.remove('is-active');
            document.body.style.overflow = '';
        };

        if (close) close.onclick = hide;
        if (overlay) overlay.onclick = hide;
        
        document.querySelectorAll('#mobile-offcanvas a').forEach(a => a.onclick = hide);
    })();
    </script>
    <?php
}

/**
 * Site Data (Hardcoded Domain for Bulletproof)
 */
function get_datamaq_site_data() {
    return [
        'hero' => [
            'badge' => 'Captura automática de datos operativos',
            'title' => 'Instalación e integración de equipos IoT para energía y producción',
            'subtitle' => 'Implementación de soluciones para medir variables eléctricas y operativas, integrarlas a sistemas existentes y dejar una base técnica usable para seguimiento, diagnóstico y capacitación.',
            'primaryCta' => ['label' => 'Escribime por WhatsApp', 'href' => 'https://wa.me/5491156297160'],
            'secondaryCta' => ['label' => 'Ver alcance técnico', 'href' => '#servicios'],
            'image' => DM_THEME_URL . '/assets/media/hero-energy.svg'
        ],
        'services' => [
            'title' => 'Servicios técnicos sobre captura, integración y uso de datos',
            'intro' => 'Servicios orientados a captura automática de datos, integración técnica y formación aplicada sobre casos reales.',
            'cards' => [
                ['id' => 'iot-installation', 'title' => 'Instalación de equipos IoT', 'description' => 'Relevamiento, montaje y puesta en marcha.', 'subtitle' => 'Captura e integración inicial', 'icon' => 'bi-tools', 'items' => ['Medición de kWh y potencia', 'Captura de kilos y unidades', 'Integración con Powermate'], 'cta' => ['label' => 'Consultá por instalación', 'href' => '#contacto']],
                ['id' => 'data-advisory', 'title' => 'Asesoramiento técnico', 'description' => 'Acompañamiento para estructurar y explotar datos.', 'subtitle' => 'Datos y criterio técnico', 'icon' => 'bi-graph-up-arrow', 'items' => ['Análisis de comportamiento', 'Ordenamiento de datos', 'Soporte para reportes'], 'cta' => ['label' => 'Consultá por asesoramiento', 'href' => '#contacto']],
                ['id' => 'training', 'title' => 'Capacitaciones aplicadas', 'description' => 'Formación técnica sobre casos reales.', 'subtitle' => 'Python y APIs en contexto', 'icon' => 'bi-mortarboard-fill', 'items' => ['Python aplicado', 'Bases de datos y APIs', 'Casos reales del equipo'], 'cta' => ['label' => 'Consultá por capacitación', 'href' => 'https://cursos.datamaq.com.ar']]
            ]
        ],
        'profile' => [
            'name' => 'Agustin Bustos', 'role' => 'Técnico a cargo',
            'lead' => 'DataMaq trabaja sobre captura automática de datos operativos, con foco en energía eléctrica y producción.',
            'detail' => 'El servicio combina relevamiento en campo, implementación técnica e integración para seguimiento y diagnóstico.',
            'bullets' => ['Relevamiento en sitio.', 'Instalación y puesta en marcha.', 'Asesoramiento sobre datos.'],
            'photo' => DM_THEME_URL . '/assets/media/tecnico-a-cargo.webp'
        ],
        'process' => [
            'title' => 'Cómo trabajamos',
            'steps' => [
                ['order' => 1, 'title' => 'Relevamiento', 'desc' => 'Definimos el caso y objetivo técnico.'],
                ['order' => 2, 'title' => 'Instalación', 'desc' => 'Montaje y configuración inicial.'],
                ['order' => 3, 'title' => 'Validación', 'desc' => 'Verificamos lecturas y comunicación.'],
                ['order' => 4, 'title' => 'Cierre', 'desc' => 'Entregamos el kit y próximos pasos.']
            ]
        ],
        'faq' => [
            'title' => 'Preguntas frecuentes',
            'items' => [
                ['q' => '¿Qué datos se pueden capturar?', 'a' => 'kWh, potencia, kilos, unidades, metros, estados.'],
                ['q' => '¿Usás Powermeter?', 'a' => 'Sí, es uno de los equipos base para medición eléctrica.']
            ]
        ],
        'contact' => [
            'title' => 'Iniciá una consulta técnica',
            'subtitle' => 'Dejanos el contexto del caso y te respondemos con el siguiente paso.',
            'submitLabel' => 'Enviá tu consulta'
        ]
    ];
}

/**
 * Injection Functions
 */
function blocksy_child_inject_hero() {
    $data = get_datamaq_site_data()['hero']; ?>
    <section class="section-mobile c-home-hero tw:relative tw:bg-center tw:bg-no-repeat tw:bg-cover tw:overflow-hidden" 
             style="background-image: linear-gradient(180deg, rgba(12, 9, 47, 0.42), rgba(12, 9, 47, 0.96)), url('<?php echo $data['image']; ?>'); padding-block: 100px; min-height: 80vh;">
        <div class="tw:container tw:mx-auto tw:px-4 tw:relative tw:z-10">
            <div class="tw:grid tw:grid-cols-1 lg:tw:grid-cols-12 tw:gap-8">
                <div class="tw:col-span-12">
                    <div class="c-home-hero__copy tw:p-8 lg:tw:p-12 tw:border tw:border-white/10 tw:rounded-[2rem] tw:bg-[#1a1c3d] tw:shadow-2xl">
                        <span class="c-home-eyebrow tw:inline-flex tw:items-center tw:rounded-full tw:px-4 tw:py-2 tw:mb-6 tw:bg-white/5 tw:text-[#ff9a4d] tw:text-[0.9rem] tw:font-black tw:uppercase tw:tracking-widest"><?php echo $data['badge']; ?></span>
                        <h1 class="tw:m-0 tw:text-[clamp(2.5rem,6vw,5rem)] tw:leading-[0.9] tw:tracking-tighter tw:text-white"><?php echo $data['title']; ?></h1>
                        <p class="tw:max-w-[55ch] tw:mt-6 tw:text-white/80 tw:leading-relaxed tw:text-xl"><?php echo $data['subtitle']; ?></p>
                        <div class="tw:flex tw:flex-wrap tw:gap-6 tw:mt-8">
                            <a href="<?php echo $data['primaryCta']['href']; ?>" class="tw:btn-primary tw:px-10 tw:py-5 tw:text-xl tw:font-black"><?php echo $data['primaryCta']['label']; ?></a>
                            <a href="<?php echo $data['secondaryCta']['href']; ?>" class="tw:btn-outline tw:px-10 tw:py-5 tw:text-xl"><?php echo $data['secondaryCta']['label']; ?></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <?php
}

function blocksy_child_inject_profile() {
    $data = get_datamaq_site_data()['profile']; ?>
    <section id="perfil" class="section-mobile tw:py-24 tw:bg-[#0c092f]">
        <div class="tw:container tw:mx-auto tw:px-4">
            <div class="tw:grid tw:grid-cols-1 lg:tw:grid-cols-12 tw:gap-16 tw:items-center">
                <div class="tw:col-span-4">
                    <img src="<?php echo $data['photo']; ?>" alt="<?php echo $data['name']; ?>" class="tw:w-full tw:aspect-square tw:rounded-3xl tw:border-4 tw:border-[#ff9a4d] tw:shadow-2xl tw:object-cover">
                </div>
                <div class="tw:col-span-8">
                    <h2 class="tw:text-5xl tw:tracking-tighter tw:text-white tw:mb-6"><?php echo $data['name']; ?></h2>
                    <p class="tw:text-[#ff9a4d] tw:font-black tw:uppercase tw:tracking-widest tw:text-lg tw:mb-6"><?php echo $data['role']; ?></p>
                    <p class="tw:text-2xl tw:text-white/90 tw:leading-relaxed tw:mb-10"><?php echo $data['lead']; ?></p>
                    <a href="https://wa.me/5491156297160" class="tw:btn-primary tw:px-12 tw:py-4 tw:text-lg">Conversar por WhatsApp</a>
                </div>
            </div>
        </div>
    </section>
    <?php
}

function blocksy_child_inject_services() {
    $data = get_datamaq_site_data()['services']; ?>
    <section id="servicios" class="section-mobile tw:py-24 tw:bg-[#151631]">
        <div class="tw:container tw:mx-auto tw:px-4">
            <h2 class="tw:text-5xl tw:tracking-tighter tw:text-white tw:mb-16"><?php echo $data['title']; ?></h2>
            <div class="tw:grid tw:grid-cols-1 md:tw:grid-cols-3 tw:gap-10">
                <?php foreach ($data['cards'] as $card): ?>
                <div class="tw:p-12 tw:bg-[#1a1c3d] tw:border tw:border-white/10 tw:rounded-[2.5rem] tw:shadow-xl">
                    <h3 class="tw:text-2xl tw:font-bold tw:text-white tw:mb-2"><?php echo $card['title']; ?></h3>
                    <p class="tw:text-[#ff9a4d] tw:font-bold tw:mb-6"><?php echo $card['subtitle']; ?></p>
                    <ul class="tw:space-y-4 tw:mb-10">
                        <?php foreach ($card['items'] as $item): ?>
                        <li class="tw:flex tw:items-center tw:gap-3 tw:text-white/80">
                            <span class="tw:w-2 tw:h-2 tw:bg-[#ff9a4d] tw:rounded-full"></span>
                            <?php echo $item; ?>
                        </li>
                        <?php endforeach; ?>
                    </ul>
                    <a href="<?php echo $card['cta']['href']; ?>" class="tw:btn-outline tw:w-full"><?php echo $card['cta']['label']; ?></a>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php
}

function blocksy_child_inject_footer_sections() {
    $process = get_datamaq_site_data()['process']; $faq = get_datamaq_site_data()['faq']; ?>
    <section id="proceso" class="section-mobile tw:py-24 tw:bg-[#0c092f]">
        <div class="tw:container tw:mx-auto tw:px-4">
             <h2 class="tw:text-5xl tw:tracking-tighter tw:text-white tw:mb-16"><?php echo $process['title']; ?></h2>
             <div class="tw:grid tw:grid-cols-1 md:tw:grid-cols-4 tw:gap-12">
                <?php foreach ($process['steps'] as $step): ?>
                <div class="tw:p-1">
                    <span class="tw:text-6xl tw:font-black tw:text-white/5 tw:mb-6 tw:block"><?php echo $step['order']; ?></span>
                    <h3 class="tw:text-xl tw:font-bold tw:text-white tw:mb-3"><?php echo $step['title']; ?></h3>
                    <p class="tw:text-white/60 tw:leading-relaxed"><?php echo $step['desc']; ?></p>
                </div>
                <?php endforeach; ?>
             </div>
        </div>
    </section>
    <section id="faq" class="section-mobile tw:py-24 tw:bg-[#151631]">
        <div class="tw:container tw:mx-auto tw:px-4">
            <h2 class="tw:text-5xl tw:tracking-tighter tw:text-white tw:mb-16"><?php echo $faq['title']; ?></h2>
            <div class="tw:max-w-4xl tw:space-y-8">
                <?php foreach ($faq['items'] as $item): ?>
                <details class="tw:group tw:p-8 tw:bg-[#1a1c3d] tw:rounded-3xl tw:border tw:border-white/10">
                    <summary class="tw:text-xl tw:font-bold tw:text-white tw:cursor-pointer tw:flex tw:justify-between tw:items-center list-none">
                        <?php echo $item['q']; ?>
                        <span class="tw:text-[#ff9a4d] tw:text-3xl">+</span>
                    </summary>
                    <p class="tw:mt-6 tw:text-white/70 tw:text-lg tw:leading-relaxed"><?php echo $item['a']; ?></p>
                </details>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php
}

function blocksy_child_inject_contact_form() {
    $data = get_datamaq_site_data()['contact']; ?>
    <section id="contacto" class="section-mobile tw:py-32 tw:bg-[#0c092f]">
        <div class="tw:container tw:mx-auto tw:px-4">
            <div class="tw:max-w-4xl tw:mx-auto tw:p-16 tw:bg-[#1a1c3d] tw:rounded-[3rem] tw:border tw:border-white/10 tw:shadow-2xl">
                <h2 class="tw:text-5xl tw:font-bold tw:text-white tw:mb-6"><?php echo $data['title']; ?></h2>
                <p class="tw:text-white/70 tw:mb-12 tw:text-xl"><?php echo $data['subtitle']; ?></p>
                <form id="dm-contact-form" class="tw:grid tw:grid-cols-1 tw:gap-8">
                    <?php wp_nonce_field( 'dm_contact_nonce', 'dm_contact_nonce_field' ); ?>
                    <input type="hidden" name="action" value="submit_contact">
                    <div>
                        <label class="tw:block tw:text-sm tw:font-bold tw:text-white/40 tw:mb-3 tw:uppercase">Su Correo Electrónico</label>
                        <input type="email" name="email" required class="tw:w-full tw:bg-black/40 tw:border-2 tw:border-white/5 tw:rounded-2xl tw:px-8 tw:py-5 tw:text-white tw:text-lg focus:tw:border-[#ff9a4d] tw:outline-none tw:transition-colors">
                    </div>
                    <div>
                        <label class="tw:block tw:text-sm tw:font-bold tw:text-white/40 tw:mb-3 tw:uppercase">Detalle Técnico de su Consulta</label>
                        <textarea name="message" required rows="6" class="tw:w-full tw:bg-black/40 tw:border-2 tw:border-white/5 tw:rounded-2xl tw:px-8 tw:py-5 tw:text-white tw:text-lg focus:tw:border-[#ff9a4d] tw:outline-none tw:transition-colors" placeholder="Describa el equipo, variable a medir o requerimiento..."></textarea>
                    </div>
                    <button type="submit" id="dm-submit-btn" class="tw:btn-primary tw:w-full tw:py-6 tw:text-2xl tw:font-black">
                        <span id="dm-btn-text"><?php echo $data['submitLabel']; ?></span>
                    </button>
                    <p id="dm-form-feedback" class="tw:mt-8 tw:text-center tw:text-xl tw:font-bold tw:hidden"></p>
                </form>
            </div>
        </div>
        <script>
        (function() {
            const form = document.getElementById('dm-contact-form');
            if (form) {
                form.onsubmit = async function(e) {
                    e.preventDefault();
                    const btn = document.getElementById('dm-submit-btn');
                    const fb = document.getElementById('dm-form-feedback');
                    btn.disabled = true; fb.style.display = 'block'; fb.textContent = 'Enviando...'; fb.style.color = '#fff';
                    try {
                        const res = await fetch('https://datamaq.com.ar/wp-admin/admin-ajax.php', {
                            method: 'POST',
                            body: new FormData(form)
                        });
                        const d = await res.json();
                        fb.textContent = d.data.message;
                        fb.style.color = d.success ? '#ff9a4d' : '#ef4444';
                        if (d.success) form.reset();
                    } catch (err) { fb.textContent = 'Error.'; fb.style.color = '#ef4444'; }
                    finally { btn.disabled = false; }
                };
            }
        })();
        </script>
    </section>
    <?php
}

/**
 * AJAX Handler
 */
add_action( 'wp_ajax_submit_contact', 'dm_handle_contact_submission' );
add_action( 'wp_ajax_nopriv_submit_contact', 'dm_handle_contact_submission' );
function dm_handle_contact_submission() {
    check_ajax_referer( 'dm_contact_nonce', 'dm_contact_nonce_field' );
    $email = sanitize_email( $_POST['email'] );
    $message = sanitize_textarea_field( $_POST['message'] );
    if ( ! is_email( $email ) || empty( $message ) ) { wp_send_json_error( ['message' => 'Email inválido.'] ); }
    $sent = wp_mail( 'info@datamaq.com.ar', 'DataMaq: Consulta Técnica', "De: $email\n\n$message" );
    wp_send_json_success( ['message' => $sent ? 'Consulta enviada. Agustín te contactará pronto.' : 'Error al enviar email.'] );
}
