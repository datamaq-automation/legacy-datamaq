<script setup lang="ts">
import { RouterLink } from 'vue-router'
import ContactFormSection from '@/ui/features/contact/ContactFormSection.vue'
import ConsentBanner from '@/ui/features/contact/ConsentBanner.vue'
import WhatsAppFab from '@/ui/features/contact/WhatsAppFab.vue'
import { useContactPage } from './ContactPage'
import { isWhatsAppUrl, reportGtagConversion } from '@/ui/utils/gtagConversion'

const {
  navbar,
  footer,
  legal,
  contact,
  contactPage,
  contactCtaEnabled,
  isContactFormActive,
  homeLinks,
  footerYear,
  whatsappHref,
  isExternalWhatsappHref,
  contactIntroLinks,
  handleChat,
  handleContactSubmit
} = useContactPage()

function handleFooterWhatsAppClick(event: MouseEvent): boolean | void {
  const whatsappUrl = whatsappHref.value
  if (!isWhatsAppUrl(whatsappUrl)) {
    return
  }

  event.preventDefault()
  return reportGtagConversion(whatsappUrl)
}
</script>

<template>
  <div class="app-shell app-shell--contact tw:min-h-screen">
    <a class="skip-link" href="#contenido-principal">Saltar al contenido principal</a>

    <header class="c-contact-page-header" role="banner">
      <div class="container c-contact-page-header__inner">
        <RouterLink class="c-contact-page-header__brand" to="/" :aria-label="navbar.brandAriaLabel">
          <span class="c-contact-page-header__brand-icon" aria-hidden="true">
            <i class="bi bi-terminal-fill"></i>
          </span>
          <span>{{ navbar.brand }}</span>
        </RouterLink>

        <nav class="c-contact-page-header__nav tw:hidden tw:lg:flex" aria-label="Navegacion principal">
          <RouterLink
            v-for="link in homeLinks"
            :key="link.label"
            class="c-contact-page-header__nav-link"
            :to="link.to"
          >
            {{ link.label }}
          </RouterLink>
        </nav>

        <div class="c-contact-page-header__actions">
          <button
            v-if="contactCtaEnabled"
            type="button"
            class="tw:btn-primary tw:hidden tw:lg:inline-flex"
            @click="handleChat('contact-header', whatsappHref)"
          >
            {{ navbar.contactLabel }}
          </button>
          <RouterLink
            class="tw:btn-outline tw:lg:hidden"
            to="/"
          >
            {{ contactPage.homeButtonLabel }}
          </RouterLink>
        </div>
      </div>
    </header>

    <main id="contenido-principal" class="c-contact-page-main">
      <section class="section-mobile c-contact-page-hero" aria-labelledby="contact-page-title">
        <div class="tw:container tw:mx-auto tw:px-4">
          <div class="tw:grid tw:grid-cols-1 tw:lg:grid-cols-12 tw:gap-8 tw:items-stretch">
            <div class="tw:col-span-1 tw:lg:col-span-12 lg:tw:col-span-5">
              <article class="c-contact-page-panel c-contact-page-panel--intro">
                <span class="c-contact-page-eyebrow">{{ contactPage.eyebrow }}</span>
                <h1 id="contact-page-title" class="c-contact-page-title">{{ contact.title }}</h1>
                <p class="c-contact-page-copy">{{ contact.subtitle }}</p>

                <div class="c-contact-page-chips" aria-label="Accesos a la home">
                  <RouterLink
                    v-for="link in contactIntroLinks"
                    :key="link.label"
                    class="c-contact-page-chip"
                    :to="link.to"
                  >
                    {{ link.label }}
                  </RouterLink>
                </div>
              </article>
            </div>

            <div class="tw:col-span-1 tw:lg:col-span-12 lg:tw:col-span-7">
              <article class="c-contact-page-panel c-contact-page-panel--support">
                <p class="c-contact-page-support-label">{{ contactPage.supportTitle }}</p>
                <ul class="c-contact-page-support-list">
                  <li v-for="item in contactPage.supportItems" :key="item">{{ item }}</li>
                </ul>

                <div class="c-contact-page-support-actions">
                  <button
                    v-if="contactCtaEnabled"
                    type="button"
                    class="btn c-ui-btn c-ui-btn--primary"
                    @click="handleChat('contact-hero', whatsappHref)"
                  >
                    {{ navbar.contactLabel }}
                  </button>
                  <RouterLink class="btn c-ui-btn c-ui-btn--outline" to="/">
                    {{ contactPage.supportBackHomeLabel }}
                  </RouterLink>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <ContactFormSection
        v-if="isContactFormActive"
        section-id="contacto"
        :title="contact.title"
        :subtitle="contact.subtitle"
        :submit-label="contactPage.primaryFormSubmitLabel"
        :on-submit="handleContactSubmit"
      />

      <footer class="c-contact-page-footer" role="contentinfo">
        <div class="tw:container tw:mx-auto tw:px-4 tw:flex tw:items-center tw:justify-between tw:gap-4 c-contact-page-footer__inner">
          <div>
            <p class="c-contact-page-footer__brand">{{ navbar.brand }}</p>
            <p class="c-contact-page-footer__note">(c) {{ footerYear }} {{ footer.note }}</p>
          </div>
          <p class="c-contact-page-footer__legal">{{ legal.text }}</p>
          <a
            class="c-contact-page-footer__whatsapp"
            :href="whatsappHref"
            :target="isExternalWhatsappHref ? '_blank' : undefined"
            :rel="isExternalWhatsappHref ? 'noopener noreferrer' : undefined"
            @click="handleFooterWhatsAppClick"
          >
            {{ navbar.contactLabel }}
          </a>
        </div>
      </footer>
    </main>

    <ConsentBanner />
    <WhatsAppFab />
  </div>
</template>

<style scoped lang="scss">
.app-shell--contact {
  background:
    radial-gradient(circle at top right, rgba(var(--dm-accent-orange-rgb), 0.14), transparent 24%),
    linear-gradient(180deg, var(--dm-bg-0) 0%, var(--dm-bg-1) 40%, var(--dm-bg-2) 100%);
  color: var(--dm-text-0);
}

.c-contact-page-header {
  position: sticky;
  top: 0;
  z-index: 1040;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: rgba(2, 12, 27, 0.82);
  border-bottom: 1px solid rgba(var(--dm-text-0-rgb), 0.1);
}

.c-contact-page-header__inner,
.c-contact-page-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.c-contact-page-header__inner {
  min-height: 4.5rem;
}

.c-contact-page-header__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--dm-text-0);
  text-decoration: none;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.c-contact-page-header__brand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  background: rgba(var(--dm-accent-orange-rgb), 0.14);
  color: rgb(var(--dm-accent-orange-rgb));
}

.c-contact-page-header__nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.c-contact-page-header__nav-link {
  color: rgba(var(--dm-text-0-rgb), 0.78);
  text-decoration: none;
  font-size: 0.95rem;
}

.c-contact-page-header__nav-link:hover,
.c-contact-page-header__nav-link:focus-visible {
  color: rgb(var(--dm-accent-orange-rgb));
}

.c-contact-page-main {
  position: relative;
}

.c-contact-page-hero {
  padding-block: clamp(1.1rem, 3.2vw, 2.2rem);
}

.c-contact-page-panel {
  height: 100%;
  padding: clamp(1.4rem, 3vw, 2rem);
  border: 1px solid rgba(var(--dm-text-0-rgb), 0.1);
  border-radius: 1.5rem;
  background: rgba(6, 20, 38, 0.82);
  box-shadow: 0 1.2rem 2.6rem rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.c-contact-page-eyebrow,
.c-contact-page-support-label {
  display: inline-flex;
  color: rgb(var(--dm-accent-orange-rgb));
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.72rem;
  font-weight: 800;
}

.c-contact-page-title {
  margin: 0.85rem 0 0;
  font-size: clamp(2.2rem, 4vw, 3.6rem);
  line-height: 0.98;
  letter-spacing: -0.03em;
}

.c-contact-page-copy,
.c-contact-page-footer__legal {
  margin: 1rem 0 0;
  color: rgba(var(--dm-text-0-rgb), 0.72);
  line-height: 1.65;
}

.c-contact-page-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.c-contact-page-chip {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  padding: 0.6rem 1rem;
  border: 1px solid rgba(var(--dm-text-0-rgb), 0.1);
  border-radius: 999px;
  color: rgba(var(--dm-text-0-rgb), 0.8);
  background: rgba(var(--dm-text-0-rgb), 0.05);
  text-decoration: none;
}

.c-contact-page-chip:hover,
.c-contact-page-chip:focus-visible {
  color: rgb(var(--dm-accent-orange-rgb));
  background: rgba(var(--dm-accent-orange-rgb), 0.12);
}

.c-contact-page-support-list {
  display: grid;
  gap: 0.85rem;
  padding-left: 1.1rem;
  margin: 1rem 0 0;
  color: rgba(var(--dm-text-0-rgb), 0.8);
}

.c-contact-page-support-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1.5rem;
}

.app-shell--contact :deep(.c-contact) {
  background: transparent;
}

.app-shell--contact :deep(.c-contact__card) {
  background: rgba(8, 23, 40, 0.94) !important;
  border: 1px solid rgba(var(--dm-text-0-rgb), 0.1) !important;
  box-shadow: 0 1.4rem 3rem rgba(0, 0, 0, 0.3) !important;
}

.app-shell--contact :deep(.c-contact__title) {
  color: var(--dm-text-0) !important;
}

.app-shell--contact :deep(.c-contact__subtitle) {
  color: rgba(var(--dm-text-0-rgb), 0.72) !important;
}

.app-shell--contact :deep(.c-contact .form-label) {
  color: rgba(var(--dm-text-0-rgb), 0.58);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  font-weight: 700;
}

.app-shell--contact :deep(.c-contact .form-control) {
  background: rgba(17, 34, 64, 0.88);
  border-color: rgba(var(--dm-text-0-rgb), 0.12);
  color: var(--dm-text-0);
}

.app-shell--contact :deep(.c-contact .form-control::placeholder) {
  color: rgba(var(--dm-text-0-rgb), 0.42);
}

.c-contact-page-footer {
  padding: 2rem 0 5rem;
  border-top: 1px solid rgba(var(--dm-text-0-rgb), 0.08);
  background: rgba(2, 12, 27, 0.92);
}

.c-contact-page-footer__inner {
  align-items: end;
}

.c-contact-page-footer__brand,
.c-contact-page-footer__note {
  margin: 0;
}

.c-contact-page-footer__brand {
  font-weight: 800;
  letter-spacing: 0.03em;
}

.c-contact-page-footer__note {
  color: rgba(var(--dm-text-0-rgb), 0.56);
}

.c-contact-page-footer__whatsapp {
  color: rgb(var(--dm-accent-orange-rgb));
  text-decoration: none;
  font-weight: 700;
}

@media (max-width: 991.98px) {
  .c-contact-page-footer__inner {
    display: grid;
    gap: 1rem;
    align-items: start;
  }
}

@media (max-width: 767.98px) {
  .c-contact-page-support-actions {
    flex-direction: column;
  }

  .c-contact-page-support-actions > * {
    width: 100%;
  }
}
</style>
