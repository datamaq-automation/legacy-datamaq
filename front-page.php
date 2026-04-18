<?php
/**
 * The template for displaying the home page.
 */

get_header();
?>

<div id="primary" class="content-area">
	<main id="main" class="site-main">
		<div class="entry-content ct-container-full">
			<?php
			// Bulletproof Section Injection
			blocksy_child_inject_hero();
			blocksy_child_inject_profile();
			blocksy_child_inject_services();
			blocksy_child_inject_footer_sections();
			blocksy_child_inject_contact_form();
			?>
		</div>
	</main>
</div>

<?php
get_footer();
