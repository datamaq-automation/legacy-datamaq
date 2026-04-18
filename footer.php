<?php
/**
 * The template for displaying the footer.
 *
 * @package Blocksy
 */

?>
    <footer class="tw:py-12 tw:bg-[#0c092f] tw:border-t tw:border-white/10 tw:text-white/60">
        <div class="tw:container tw:mx-auto tw:px-4">
            <div class="tw:grid tw:grid-cols-1 md:tw:grid-cols-3 tw:gap-8 tw:mb-12">
                <div>
                    <h3 class="tw:text-xl tw:font-bold tw:text-white tw:mb-4">DataMaq</h3>
                    <p class="tw:text-sm">Captura automática e integración de datos energéticos y operativos en entornos industriales.</p>
                </div>
                <div>
                    <h4 class="tw:font-bold tw:text-white tw:mb-4">Accesos Rápidos</h4>
                    <ul class="tw:space-y-2 tw:text-sm">
                        <li><a href="#servicios" class="hover:tw:text-dm-primary">Solución</a></li>
                        <li><a href="#proceso" class="hover:tw:text-dm-primary">Proceso</a></li>
                        <li><a href="#faq" class="hover:tw:text-dm-primary">FAQ</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="tw:font-bold tw:text-white tw:mb-4">Contacto</h4>
                    <ul class="tw:space-y-2 tw:text-sm">
                        <li>Garín, GBA Norte</li>
                        <li><a href="mailto:info@datamaq.com.ar" class="hover:tw:text-dm-primary">info@datamaq.com.ar</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="tw:pt-8 tw:border-t tw:border-white/5 tw:flex tw:flex-col md:tw:flex-row tw:justify-between tw:items-center tw:gap-4">
                <p class="tw:text-xs">© <?php echo date('Y'); ?> DataMaq. Todos los derechos reservados.</p>
                <p class="tw:text-xs">Base operativa: Garín (GBA Norte)</p>
            </div>
        </div>
    </footer>

<?php wp_footer(); ?>

</body>
</html>
