<script setup lang="ts">
import { RouterLink } from 'vue-router'
import ContactFormSection from '@/ui/features/contact/ContactFormSection.vue'
import ConsentBanner from '@/ui/features/contact/ConsentBanner.vue'
import WhatsAppFab from '@/ui/features/contact/WhatsAppFab.vue'
import HomeFaqList from '@/ui/pages/home/HomeFaqList.vue'
import HomeHeroTrustSignals from '@/ui/pages/home/HomeHeroTrustSignals.vue'
import { createFooterWhatsAppClickHandler } from '@/ui/pages/home/homePageUiHandlers'
import { useHomePage } from './HomePage'

// ARCH-ROADMAP: modularizacion incremental documentada en docs/homepage-modularization-plan.md.

const {
  navbar,
  hero,
  services,
  about,
  homeVariant,
  isDirectVariant,
  isAuthorityVariant,
  homePage,
  footer,
  legal,
  contactCtaEnabled,
  isContactFormActive,
  whatsappHref,
  isExternalWhatsappHref,
  heroConditions,
  headerLinks,
  quickLinks,
  dockLinks,
  trustSignals,
  faqItems,
  profileLead,
  profileDetail,
  profileBenefits,
  authorityHighlights,
  urgencyBadge,
  emergencyLabel,
  footerYear,
  handleChat,
  getServiceIcon,
  handleContactSubmit
} = useHomePage()

const handleFooterWhatsAppClick = createFooterWhatsAppClickHandler(whatsappHref)
</script>

<template>
  <div
    id="top"
    :class="[
      'app-shell app-shell--home tw:min-h-screen',
      `app-shell--variant-${homeVariant}`
    ]"
  >
    <a class="skip-link" href="#contenido-principal">Saltar al contenido principal</a>

    <header class="c-home-header" role="banner">
      <div class="tw:container tw:mx-auto tw:px-4 c-home-header__inner">
        <RouterLink class="tw:flex tw:items-center tw:gap-2 tw:text-dm-text-0 tw:decoration-0" to="/" :aria-label="navbar.brandAriaLabel">
          <span class="c-home-header__brand-icon" aria-hidden="true">
            <i class="bi bi-terminal-fill"></i>
          </span>
          <span class="c-home-header__brand-copy">{{ navbar.brand }}</span>
        </RouterLink>

        <nav class="c-home-header__nav tw:hidden tw:lg:flex" aria-label="Navegacion principal">
          <RouterLink
            v-for="link in headerLinks" :key="link.href"
            class="c-home-header__nav-link"
            :to="link.to"
          >
            {{ link.label }}
          </RouterLink>
        </nav>

        <div class="c-home-header__actions">
          <RouterLink
            v-for="link in quickLinks" :key="link.href"
            class="c-home-header__icon-link tw:lg:hidden"
            :to="link.to"
            :aria-label="link.label"
            :title="link.label"
          >
            <i :class="['bi', link.icon]" aria-hidden="true"></i>
          </RouterLink>

          <button
            v-if="contactCtaEnabled"
            type="button"
            class="tw:btn-primary c-home-header__cta tw:hidden tw:lg:inline-flex"
            @click="handleChat('header-emergency', whatsappHref)"
          >
            {{ isDirectVariant ? emergencyLabel : homePage.headerContactLabel }}
          </button>
          <RouterLink
            v-else
            class="tw:btn-outline c-home-header__cta tw:hidden tw:lg:inline-flex"
            to="/contact"
          >
            {{ homePage.headerContactLabel }}
          </RouterLink>
        </div>
      </div>
    </header>

    <main id="contenido-principal" class="c-home-main with-floating-cta">
      <section
        class="section-mobile c-home-hero"
        :class="{
          'c-home-hero--direct': isDirectVariant,
          'c-home-hero--authority': isAuthorityVariant
        }"
        aria-labelledby="hero-title"
        :style="{
          backgroundImage: `linear-gradient(180deg, rgba(4, 18, 35, 0.42), rgba(2, 12, 27, 0.96)), url('${isAuthorityVariant ? about.image.src : hero.image.src}')`
        }"
      >
        <div class="tw:container tw:mx-auto tw:px-4">
          <div class="tw:grid tw:grid-cols-1 tw:lg:grid-cols-12 tw:gap-8 tw:items-end">
            <div class="tw:col-span-1 tw:lg:col-span-7">
              <div class="c-home-hero__copy">
                <span class="c-home-eyebrow">{{ hero.badge }}</span>
                <h1 id="hero-title" class="c-home-hero__title">
                  {{ isDirectVariant ? 'Servicio Tecnico Industrial Especializado' : hero.title }}
                </h1>
                <p class="c-home-hero__subtitle">
                  {{ hero.subtitle }}
                </p>

                <div class="c-home-hero__actions">
                  <button
                    v-if="contactCtaEnabled"
                    type="button"
                    class="tw:btn-primary c-home-hero__primary"
                    @click="handleChat('hero', hero.primaryCta.href)"
                  >
                    {{ isDirectVariant ? 'Emergencia tecnica por WhatsApp' : 'Contactar por WhatsApp' }}
                  </button>
                  <a
                    v-else
                    class="tw:btn-primary c-home-hero__primary"
                    href="#contacto"
                  >
                    {{ isDirectVariant ? emergencyLabel : homePage.heroFallbackContactLabel }}
                  </a>

                  <RouterLink
                    v-if="!isDirectVariant"
                    class="tw:btn-outline c-home-hero__secondary"
                    :to="{ path: '/', hash: '#servicios' }"
                  >
                    {{ hero.secondaryCta.label }}
                  </RouterLink>
                </div>

                <p class="c-home-hero__urgency" role="status">
                  <i class="bi bi-lightning-charge-fill" aria-hidden="true"></i>
                  <span>{{ urgencyBadge }}</span>
                </p>
                <p class="c-home-hero__prefill">
                  WhatsApp abre con mensaje precargado para agilizar la asistencia.
                </p>
                <HomeHeroTrustSignals :trust-logos="homePage.trustLogos" :trust-signals="trustSignals" />

                <ul class="c-home-hero__signals" aria-label="Condiciones operativas">
                  <li v-for="condition in heroConditions" :key="condition">
                    {{ condition }}
                  </li>
                </ul>
              </div>
            </div>

            <div
              class="tw:col-span-1 tw:lg:col-span-5"
              :class="{ 'tw:hidden tw:lg:block': isDirectVariant }"
            >
              <article class="c-home-hero__media-card">
                <p class="c-home-hero__media-label">{{ homePage.heroMediaLabel }}</p>
                <img
                  :src="isAuthorityVariant ? about.image.src : hero.image.src"
                  :alt="isAuthorityVariant ? about.image.alt : hero.image.alt"
                  class="c-home-hero__image"
                  :width="isAuthorityVariant ? about.image.width : hero.image.width"
                  :height="isAuthorityVariant ? about.image.height : hero.image.height"
                  fetchpriority="high"
                  loading="eager"
                  decoding="async"
                />
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="perfil" class="section-mobile c-home-profile" aria-labelledby="perfil-title">
        <div class="tw:container tw:mx-auto tw:px-4">
          <div class="tw:grid tw:grid-cols-1 tw:lg:grid-cols-12 tw:gap-8 tw:items-stretch">
            <div class="tw:col-span-1 tw:lg:col-span-5">
              <article class="c-home-panel c-home-profile__card">
                <span class="c-home-eyebrow">{{ homePage.profileEyebrow }}</span>
                <div class="c-home-profile__avatar-wrap tw:flex">
                  <img
                    :src="about.image.src"
                    :alt="about.image.alt"
                    class="c-home-profile__avatar"
                    :width="about.image.width"
                    :height="about.image.height"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <h2 id="perfil-title" class="c-home-profile__name">{{ homePage.profileName }}</h2>
                <p class="c-home-profile__role">{{ about.title }}</p>
                <p>
                  {{ profileLead }}
                </p>
                <button
                  v-if="contactCtaEnabled"
                  type="button"
                  class="tw:btn-primary c-home-profile__cta"
                  @click="handleChat('profile-card', whatsappHref)"
                >
                  {{ isDirectVariant ? `${emergencyLabel} por WhatsApp` : homePage.profileWhatsappLabel }}
                </button>
                  <RouterLink
                    v-else
                    class="tw:btn-outline c-home-profile__cta"
                    to="/contact"
                  >
                    {{ homePage.profileFormLabel }}
                   </RouterLink>
              </article>
            </div>

            <div class="tw:col-span-1 tw:lg:col-span-7">
              <article class="c-home-panel c-home-profile__details">
                <p class="c-home-profile__section-label">
                  {{ isAuthorityVariant ? 'Por que elegirnos' : homePage.profileSectionLabel }}
                </p>
                <p class="c-home-profile__detail-copy">
                  {{ profileDetail }}
                </p>
                <ul v-if="isAuthorityVariant" class="c-home-profile__bullets c-home-profile__bullets--authority">
                  <li v-for="highlight in authorityHighlights" :key="highlight">
                    <span class="c-home-profile__bullet-dot" aria-hidden="true"></span>
                    <span>{{ highlight }}</span>
                  </li>
                </ul>
                <div class="c-home-profile__benefits-grid">
                  <article
                    v-for="benefit in profileBenefits"
                    :key="benefit.text"
                    class="c-home-profile__benefit-card"
                  >
                    <span class="c-home-profile__benefit-icon" aria-hidden="true">
                      <i :class="['bi', benefit.icon]"></i>
                    </span>
                    <p>{{ benefit.text }}</p>
                  </article>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="servicios" class="section-mobile c-home-services" aria-labelledby="servicios-title">
        <div class="tw:container tw:mx-auto tw:px-4">
          <div class="c-home-section-head">
            <span class="c-home-eyebrow">{{ homePage.servicesEyebrow }}</span>
            <h2 id="servicios-title" class="c-home-section-title">
              {{ services.title }}
            </h2>
            <p class="c-home-section-copy">
              {{ homePage.servicesIntro }}
            </p>
          </div>

          <div class="c-home-services__grid">
            <article
              v-for="card in services.cards"
              :key="card.id"
              class="c-home-service-card"
            >
              <div class="c-home-service-card__summary">
                <span class="c-home-service-card__icon" aria-hidden="true">
                  <i :class="['bi', getServiceIcon(card.id, card.title)]"></i>
                </span>
                <span class="c-home-service-card__summary-copy">
                  <span class="c-home-service-card__title">{{ card.title }}</span>
                  <span class="c-home-service-card__description">{{ card.description }}</span>
                </span>
              </div>

              <div class="c-home-service-card__content">
                <p class="c-home-service-card__subtitle">{{ card.subtitle }}</p>
                <ul class="c-home-service-card__list">
                  <li v-for="item in card.items.slice(0, 3)" :key="item">
                    <span class="c-home-service-card__bullet" aria-hidden="true">
                      <i class="bi bi-check2-circle"></i>
                    </span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
                <p v-if="card.note" class="c-home-service-card__note">
                  {{ card.note }}
                </p>
                <button
                  v-if="contactCtaEnabled"
                  type="button"
                  class="tw:btn-outline c-home-service-card__cta"
                  @click="handleChat(`service-${card.id}`, card.cta.href)"
                >
                  {{ card.cta.label }}
                </button>
                <RouterLink
                  v-else
                  class="tw:btn-outline c-home-service-card__cta"
                  :to="card.cta.href === '#contacto' ? '/contact' : { path: '/', hash: card.cta.href || '#contacto' }"
                >
                  {{ card.cta.label }}
                </RouterLink>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="faq" class="section-mobile c-home-faq" aria-labelledby="faq-title">
        <div class="tw:container tw:mx-auto tw:px-4">
          <div class="c-home-section-head">
            <span class="c-home-eyebrow">{{ homePage.faqEyebrow }}</span>
            <h2 id="faq-title" class="c-home-section-title">{{ homePage.faqTitle }}</h2>
          </div>

          <HomeFaqList :faq-items="faqItems" />
        </div>
      </section>

      <ContactFormSection
        v-if="isContactFormActive"
        section-id="contacto"
        :title="homePage.primaryContactForm.title"
        :subtitle="homePage.primaryContactForm.subtitle"
        :submit-label="homePage.primaryContactForm.submitLabel"
        :on-submit="handleContactSubmit"
        :show-technician-card="false"
      />

      <footer class="c-home-footer" role="contentinfo">
        <div class="tw:container tw:mx-auto tw:px-4">
          <div class="c-home-footer__shell">
            <div>
              <p class="c-home-footer__brand">{{ navbar.brand }}</p>
              <p class="c-home-footer__note">(c) {{ footerYear }} {{ footer.note }}</p>
            </div>
            <p class="c-home-footer__legal">
              {{ legal.text }}
            </p>
            <a
              class="c-home-footer__whatsapp"
              :href="whatsappHref"
              :target="isExternalWhatsappHref ? '_blank' : undefined"
              :rel="isExternalWhatsappHref ? 'noopener noreferrer' : undefined"
              @click="handleFooterWhatsAppClick"
            >
              {{ navbar.contactLabel }}
            </a>
          </div>
        </div>
      </footer>
    </main>

    <ConsentBanner />
    <WhatsAppFab />

    <nav
      class="c-home-dock tw:lg:hidden"
      :class="{ 'c-home-dock--direct': isDirectVariant }"
      :style="{ '--dock-columns': String(Math.max(dockLinks.length, 1)) }"
      aria-label="Navegacion rapida"
    >
      <RouterLink
        v-for="link in dockLinks"
        :key="link.label"
        :class="[
          'c-home-dock__link',
          { 'c-home-dock__link--emergency': link.label === emergencyLabel }
        ]"
        :to="link.to"
      >
        <i :class="['bi', link.icon]" aria-hidden="true"></i>
        <span>{{ link.label }}</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped lang="scss">
.app-shell--home {
  --floating-cta-height: 5.35rem;
  --fab-offset: 6.4rem;
  background:
    radial-gradient(circle at top left, rgba(var(--dm-data-cyan-rgb), 0.16), transparent 30%),
    linear-gradient(180deg, var(--dm-bg-0) 0%, var(--dm-bg-1) 38%, var(--dm-bg-2) 100%);
  color: var(--dm-text-0);
}

.c-home-main {
  position: relative;
}

.c-home-header {
  position: sticky;
  top: 0;
  z-index: 1040;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: rgba(2, 12, 27, 0.82);
  border-bottom: 1px solid rgba(var(--dm-text-0-rgb), 0.1);
}

.c-home-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 4rem;
}

.c-home-header__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--dm-text-0);
  font-weight: 800;
  text-decoration: none;
  letter-spacing: 0.02em;
}

.c-home-header__brand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  background: rgba(var(--dm-accent-orange-rgb), 0.14);
  color: rgb(var(--dm-accent-orange-rgb));
  font-size: 1.15rem;
}

.c-home-header__nav {
  display: flex;
  align-items: center;
  gap: 1.1rem;
}

.c-home-header__nav-link {
  color: rgba(var(--dm-text-0-rgb), 0.8);
  text-decoration: none;
  font-size: 0.95rem;
}

.c-home-header__nav-link:hover,
.c-home-header__nav-link:focus-visible {
  color: rgb(var(--dm-accent-orange-rgb));
}

.c-home-header__actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.c-home-header__icon-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 999px;
  color: rgba(var(--dm-text-0-rgb), 0.86);
  text-decoration: none;
  background: rgba(var(--dm-text-0-rgb), 0.06);
  border: 1px solid rgba(var(--dm-text-0-rgb), 0.08);
}

.c-home-header__icon-link:hover,
.c-home-header__icon-link:focus-visible {
  color: rgb(var(--dm-accent-orange-rgb));
  background: rgba(var(--dm-accent-orange-rgb), 0.12);
}

.c-home-header__cta {
  min-height: 2.65rem;
  white-space: nowrap;
}

.c-home-eyebrow {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.38rem 0.85rem;
  margin-bottom: 1rem;
  background: rgba(var(--dm-accent-orange-rgb), 0.14);
  color: rgb(var(--dm-accent-orange-rgb));
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.c-home-hero {
  position: relative;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}

.c-home-hero.section-mobile {
  padding-block: clamp(1.4rem, 3vw, 2.2rem) clamp(2.4rem, 4vw, 3.1rem);
}

.c-home-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(2, 12, 27, 0.72), transparent 60%),
    linear-gradient(rgba(var(--dm-line-blueprint-rgb), 0.18) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--dm-line-blueprint-rgb), 0.18) 1px, transparent 1px);
  background-size: auto, 56px 56px, 56px 56px;
  pointer-events: none;
}

.c-home-hero > .container {
  position: relative;
  z-index: 1;
}

.c-home-hero__copy,
.c-home-hero__media-card,
.c-home-panel {
  border: 1px solid rgba(var(--dm-text-0-rgb), 0.12);
  border-radius: 1.5rem;
  background: rgba(6, 20, 38, 0.78);
  box-shadow: 0 1.4rem 3rem rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.c-home-hero__copy {
  padding: clamp(1.5rem, 4vw, 2.5rem);
}

.app-shell--variant-direct .c-home-hero__copy {
  padding: clamp(1.2rem, 3vw, 1.8rem);
}

.app-shell--variant-direct .c-home-header__inner {
  min-height: 3.7rem;
}

.app-shell--variant-authority .c-home-hero__copy {
  padding: clamp(1.4rem, 3.2vw, 2rem);
}

.c-home-hero__title,
.c-home-section-title {
  margin: 0;
  font-size: clamp(2.2rem, 4.3vw, 4rem);
  line-height: 0.98;
  letter-spacing: -0.03em;
  text-wrap: balance;
}

.c-home-hero__subtitle,
.c-home-section-copy,
.c-home-profile__lead,
.c-home-profile__detail-copy,
.c-home-footer__legal {
  color: rgba(var(--dm-text-0-rgb), 0.72);
  line-height: 1.65;
}

.c-home-hero__subtitle {
  max-width: 48ch;
  margin: 0.95rem 0 0;
}

.c-home-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  margin-top: 1.5rem;
}

.c-home-hero__urgency {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0.95rem 0 0;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  border: 1px solid rgba(var(--dm-whatsapp-green-rgb), 0.45);
  background: rgba(var(--dm-whatsapp-green-rgb), 0.18);
  color: rgba(var(--dm-text-0-rgb), 0.95);
  font-size: 0.8rem;
  font-weight: 700;
}

.c-home-hero__urgency i {
  color: rgba(var(--dm-whatsapp-green-rgb), 0.95);
}

.c-home-hero__prefill {
  margin: 0.55rem 0 0;
  color: rgba(var(--dm-text-0-rgb), 0.64);
  font-size: 0.82rem;
}

.c-home-hero__primary,
.c-home-hero__secondary,
.c-home-profile__cta,
.c-home-service-card__cta {
  min-height: 3.2rem;
}

.c-home-hero__signals {
  display: grid;
  gap: 0.7rem;
  margin: 1.5rem 0 0;
  padding: 0;
  list-style: none;
}

.c-home-hero__signals li {
  position: relative;
  padding-left: 1.2rem;
  color: rgba(var(--dm-text-0-rgb), 0.84);
}

.c-home-hero__signals li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.65rem;
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 999px;
  background: rgb(var(--dm-accent-orange-rgb));
}

.app-shell--variant-direct .c-home-hero__signals li:nth-child(n + 3) {
  display: none;
}

.c-home-hero__media-card {
  padding: 1.15rem;
}

.c-home-hero__media-label,
.c-home-profile__section-label {
  margin: 0 0 0.85rem;
  color: rgba(var(--dm-text-0-rgb), 0.6);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.7rem;
  font-weight: 700;
}

.c-home-hero__image {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 1rem;
  border: 1px solid rgba(var(--dm-text-0-rgb), 0.08);
}

.c-home-profile,
.c-home-faq {
  background: linear-gradient(180deg, rgba(3, 15, 30, 0.88), rgba(8, 23, 40, 0.88));
}

.c-home-panel {
  padding: clamp(1.3rem, 3vw, 2rem);
  height: 100%;
}

.c-home-profile__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.c-home-profile__avatar-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.c-home-profile__avatar {
  width: min(100%, 15rem);
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 999px;
  border: 3px solid rgba(var(--dm-accent-orange-rgb), 0.7);
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.32);
}

.c-home-profile__name {
  margin: 0;
  font-size: clamp(1.8rem, 2vw, 2.4rem);
  letter-spacing: -0.03em;
}

.c-home-profile__role {
  margin: 0.45rem 0 0;
  color: rgb(var(--dm-accent-orange-rgb));
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
}

.c-home-profile__lead {
  margin: 1rem 0 0;
}

.c-home-profile__cta {
  width: 100%;
  margin-top: 1.4rem;
}

.c-home-profile__detail-copy {
  margin: 0;
}

.c-home-profile__bullets {
  display: grid;
  gap: 0.8rem;
  list-style: none;
  padding: 0;
  margin: 1.25rem 0 0;
}

.c-home-profile__bullets--authority {
  margin-bottom: 1.2rem;
}

.c-home-profile__bullets li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.c-home-profile__bullet-dot {
  flex: 0 0 auto;
  width: 0.55rem;
  height: 0.55rem;
  margin-top: 0.45rem;
  border-radius: 999px;
  background: rgb(var(--dm-accent-orange-rgb));
}

.c-home-profile__benefits-grid {
  display: grid;
  gap: 0.85rem;
  grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
}

.c-home-profile__benefit-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  border-radius: 0.95rem;
  border: 1px solid rgba(var(--dm-text-0-rgb), 0.12);
  background: rgba(var(--dm-text-0-rgb), 0.03);
}

.c-home-profile__benefit-card p {
  margin: 0;
  color: rgba(var(--dm-text-0-rgb), 0.82);
  line-height: 1.5;
}

.c-home-profile__benefit-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.6rem;
  color: rgb(var(--dm-accent-orange-rgb));
  background: rgba(var(--dm-accent-orange-rgb), 0.16);
}

.c-home-section-head {
  max-width: 44rem;
  margin-bottom: 2rem;
}

.c-home-section-copy {
  margin: 0.9rem 0 0;
}

.c-home-services {
  background:
    radial-gradient(circle at top right, rgba(var(--dm-accent-orange-rgb), 0.12), transparent 24%),
    linear-gradient(180deg, rgba(2, 12, 27, 0.96), rgba(8, 23, 40, 0.96));
}

.c-home-services__grid {
  display: grid;
  gap: 1rem;
}

.c-home-service-card {
  border: 1px solid rgba(var(--dm-text-0-rgb), 0.1);
  border-radius: 1.25rem;
  background: rgba(10, 26, 48, 0.9);
  overflow: hidden;
}

.c-home-service-card {
  border-top: 3px solid rgba(var(--dm-accent-orange-rgb), 0.9);
}

.c-home-service-card__summary {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: start;
  padding: 1.25rem;
}

.c-home-service-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  color: rgb(var(--dm-accent-orange-rgb));
  background: rgba(var(--dm-accent-orange-rgb), 0.12);
  font-size: 1.15rem;
}

.c-home-service-card__summary-copy {
  display: grid;
  gap: 0.28rem;
}

.c-home-service-card__title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--dm-text-0);
}

.c-home-service-card__description {
  color: rgba(var(--dm-text-0-rgb), 0.7);
  line-height: 1.55;
}

.c-home-service-card__content {
  padding: 0 1.25rem 1.25rem;
}

.c-home-service-card__subtitle {
  margin: 0 0 1rem;
  color: rgba(var(--dm-text-0-rgb), 0.56);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.72rem;
  font-weight: 700;
}

.c-home-service-card__list {
  display: grid;
  gap: 0.72rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.c-home-service-card__list li {
  display: flex;
  gap: 0.7rem;
  color: rgba(var(--dm-text-0-rgb), 0.76);
}

.c-home-service-card__bullet {
  flex: 0 0 auto;
  color: rgb(var(--dm-accent-orange-rgb));
  margin-top: 0.12rem;
}

.c-home-service-card__note {
  margin: 1rem 0 0;
  padding-top: 1rem;
  border-top: 1px solid rgba(var(--dm-text-0-rgb), 0.08);
  color: rgba(var(--dm-text-0-rgb), 0.62);
}

.c-home-service-card__cta {
  width: 100%;
  margin-top: 1rem;
}

.c-home-footer {
  padding: 2rem 0 7rem;
  background: rgba(2, 12, 27, 0.92);
  border-top: 1px solid rgba(var(--dm-text-0-rgb), 0.08);
}

.c-home-footer__shell {
  display: grid;
  gap: 1rem;
}

.c-home-footer__brand,
.c-home-footer__note {
  margin: 0;
}

.c-home-footer__brand {
  font-weight: 800;
  letter-spacing: 0.03em;
}

.c-home-footer__note {
  color: rgba(var(--dm-text-0-rgb), 0.56);
}

.c-home-footer__legal {
  margin: 0;
  max-width: 62ch;
}

.c-home-footer__whatsapp {
  color: rgb(var(--dm-accent-orange-rgb));
  text-decoration: none;
  font-weight: 700;
}

.c-home-dock {
  position: fixed;
  left: 0.85rem;
  right: 0.85rem;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 0.75rem);
  z-index: 1045;
  display: grid;
  grid-template-columns: repeat(var(--dock-columns, 4), minmax(0, 1fr));
  gap: 0.35rem;
  padding: 0.5rem;
  border: 1px solid rgba(var(--dm-text-0-rgb), 0.1);
  border-radius: 1.35rem;
  background: rgba(4, 17, 33, 0.9);
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.c-home-dock__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  min-height: 4.2rem;
  border-radius: 0.95rem;
  color: rgba(var(--dm-text-0-rgb), 0.66);
  text-decoration: none;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.c-home-dock__link:hover,
.c-home-dock__link:focus-visible {
  color: rgb(var(--dm-accent-orange-rgb));
  background: rgba(var(--dm-accent-orange-rgb), 0.12);
}

.c-home-dock__link i {
  font-size: 1.25rem;
}

.c-home-dock--direct .c-home-dock__link {
  min-height: 4.35rem;
}

.c-home-dock__link--emergency {
  color: rgba(var(--dm-whatsapp-green-rgb), 0.95);
  background: rgba(var(--dm-whatsapp-green-rgb), 0.16);
}

.c-home-dock__link--emergency:hover,
.c-home-dock__link--emergency:focus-visible {
  color: rgba(var(--dm-whatsapp-green-rgb), 0.98);
  background: rgba(var(--dm-whatsapp-green-rgb), 0.24);
}

.app-shell--home :deep(.c-contact) {
  background: linear-gradient(180deg, rgba(3, 15, 30, 0.96), rgba(10, 26, 48, 0.96));
}

.app-shell--home :deep(.c-contact__card) {
  background: rgba(8, 23, 40, 0.92) !important;
  border: 1px solid rgba(var(--dm-text-0-rgb), 0.1) !important;
  box-shadow: 0 1.4rem 3rem rgba(0, 0, 0, 0.3) !important;
}

.app-shell--home :deep(.c-contact__title) {
  color: var(--dm-text-0) !important;
  font-size: clamp(1.8rem, 2.8vw, 2.35rem);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.app-shell--home :deep(.c-contact__subtitle) {
  color: rgba(var(--dm-text-0-rgb), 0.72) !important;
  margin-bottom: 1.5rem !important;
}

.app-shell--home :deep(.c-contact .form-label) {
  color: rgba(var(--dm-text-0-rgb), 0.58);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  font-weight: 700;
}

.app-shell--home :deep(.c-contact .form-control) {
  background: rgba(17, 34, 64, 0.88);
  border-color: rgba(var(--dm-text-0-rgb), 0.12);
  color: var(--dm-text-0);
  min-height: 3.15rem;
}

.app-shell--home :deep(.c-contact textarea.form-control) {
  min-height: 8.8rem;
}

.app-shell--home :deep(.c-contact .form-control::placeholder) {
  color: rgba(var(--dm-text-0-rgb), 0.42);
}

.app-shell--home :deep(.c-contact__submit) {
  min-height: 3.3rem;
}

.app-shell--home :deep(.c-consent-banner--shell) {
  bottom: calc(var(--floating-cta-height, 5rem) + 0.75rem);
  border-radius: 1.1rem;
  border: 1px solid rgba(var(--dm-text-0-rgb), 0.12);
  background: rgba(8, 23, 40, 0.94);
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.35);
}

.app-shell--home :deep(.whatsapp-fab) {
  right: 1rem;
}

@media (max-width: 991.98px) {
  .c-home-header__inner {
    min-height: 3.75rem;
  }

  .c-home-hero__media-card {
    margin-top: 0.5rem;
  }

  .app-shell--home :deep(.c-consent-banner--shell) {
    margin-inline: 0.85rem;
  }
}

@media (min-width: 992px) {
  .app-shell--home {
    --floating-cta-height: 0rem;
    --fab-offset: 1.6rem;
  }

  .c-home-footer {
    padding-bottom: 2.5rem;
  }

  .c-home-footer__shell {
    grid-template-columns: minmax(0, 18rem) minmax(0, 1fr) auto;
    align-items: end;
  }

  .app-shell--home :deep(.c-consent-banner--shell) {
    bottom: 1rem;
  }
}

@media (max-width: 767.98px) {
  .c-home-hero__title,
  .c-home-section-title {
    font-size: clamp(2rem, 11vw, 2.85rem);
  }

  .c-home-hero__actions {
    flex-direction: column;
  }

  .c-home-hero__primary,
  .c-home-hero__secondary {
    width: 100%;
  }

  .c-home-profile__avatar {
    width: min(100%, 11.5rem);
  }

  .c-home-footer {
    padding-bottom: 7.4rem;
  }
}

@media (max-width: 575.98px) {
  .app-shell--home {
    --fab-offset: 7rem;
  }

  .c-home-header__brand-copy {
    font-size: 1rem;
  }

  .c-home-header__icon-link {
    width: 2.5rem;
    height: 2.5rem;
  }

  .c-home-hero__copy,
  .c-home-hero__media-card,
  .c-home-panel {
    border-radius: 1.2rem;
  }

  .c-home-service-card__summary {
    padding-inline: 1rem;
  }

  .c-home-service-card__content {
    padding-inline: 1rem;
  }
}
</style>
