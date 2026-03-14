<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { readQuoteWebSnapshot } from './quoteWebState'
import { isWhatsAppUrl, reportGtagConversion } from '@/ui/utils/gtagConversion'

const route = useRoute()
const quoteId = computed(() => String(route.params.quoteId ?? '').trim())
const quote = computed(() => readQuoteWebSnapshot(quoteId.value))
const hasQuote = computed(() => Boolean(quote.value))
const confirmWhatsappHref = computed(() => quote.value?.whatsapp_url ?? '#cotizador')

const technicalConditions = computed(() => {
  if (!quote.value) {
    return []
  }

  return [
    { label: 'Agendado', value: 'Sí', stateClass: 'is-positive', icon: 'bi-calendar2-check' },
    { label: 'Acceso', value: 'Listo', stateClass: 'is-positive', icon: 'bi-key-fill' },
    { label: 'Segura', value: 'Conf.', stateClass: 'is-positive', icon: 'bi-shield-check' }
  ]
})

const contactName = computed(() => {
  const whatsappMessage = quote.value?.whatsapp_message ?? ''
  const match = /Hola\s+([^,!.?]+)/i.exec(whatsappMessage)
  return match?.[1]?.trim() || 'Contacto'
})

const validUntilLabel = computed(() => {
  const value = quote.value?.valid_until
  if (!value) {
    return 'Sin vigencia disponible'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'long'
  }).format(date)
})

function formatArs(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(value)
}

function handleConfirmWhatsappClick(event: MouseEvent): boolean | void {
  const whatsappUrl = confirmWhatsappHref.value
  if (!isWhatsAppUrl(whatsappUrl)) {
    return
  }

  event.preventDefault()
  return reportGtagConversion(whatsappUrl)
}
</script>

<template>
  <div class="quote-web-page">
    <div class="quote-web-page__spacer" aria-hidden="true"></div>

    <main class="quote-web-page__content">
      <header class="quote-web-page__header">
        <div>
          <h1 class="quote-web-page__brand">DATAMAQ</h1>
          <p class="quote-web-page__subtitle">Cotización de diagnóstico</p>
        </div>
        <div class="quote-web-page__status">
          {{ hasQuote ? 'Pendiente' : 'No disponible' }}
        </div>
      </header>

      <section v-if="quote" class="quote-web-card">
        <div class="quote-web-card__top">
          <div>
            <p class="quote-web-label">ID de cotización</p>
            <p class="quote-web-card__mono">{{ quote.quote_id }}</p>
          </div>
          <i class="bi bi-receipt-cutoff quote-web-card__corner-icon" aria-hidden="true"></i>
        </div>

        <div class="quote-web-card__client">
          <p class="quote-web-label">Cliente</p>
          <p class="quote-web-card__client-name">{{ quote.quote_id }}</p>
          <p class="quote-web-card__client-contact">Contacto: {{ contactName }}</p>
        </div>
      </section>

      <section v-if="quote" class="quote-web-section">
        <h2 class="quote-web-section__title">Condiciones técnicas</h2>
        <div class="quote-web-conditions">
          <article
            v-for="condition in technicalConditions"
            :key="condition.label"
            class="quote-web-conditions__item"
          >
            <i :class="['bi', condition.icon, 'quote-web-conditions__icon']" aria-hidden="true"></i>
            <span class="quote-web-conditions__label">{{ condition.label }}</span>
            <span :class="['quote-web-conditions__value', condition.stateClass]">{{ condition.value }}</span>
          </article>
        </div>
      </section>

      <section v-if="quote" class="quote-web-section">
        <h2 class="quote-web-section__title">Detalle comercial</h2>
        <div class="quote-web-card quote-web-card--pricing">
          <div class="quote-web-pricing__row">
            <span>Precio de lista</span>
            <strong>{{ formatArs(quote.list_price_ars) }}</strong>
          </div>
          <div class="quote-web-pricing__row">
            <span>Descuento total</span>
            <strong class="is-positive">- {{ formatArs(quote.discount_total_ars) }}</strong>
          </div>
          <div class="quote-web-pricing__row quote-web-pricing__row--total">
            <span>Precio final</span>
            <strong>{{ formatArs(quote.final_price_ars) }}</strong>
          </div>
          <div class="quote-web-pricing__deposit">
            <div>
              <p class="quote-web-pricing__deposit-label">Seña requerida ({{ quote.deposit_pct }}%)</p>
              <p class="quote-web-pricing__deposit-value">{{ formatArs(quote.deposit_ars) }}</p>
            </div>
            <i class="bi bi-chevron-right" aria-hidden="true"></i>
          </div>
        </div>
      </section>

      <p v-if="quote" class="quote-web-page__validity">
        Vigencia hasta: {{ validUntilLabel }}
      </p>

      <section v-else class="quote-web-card quote-web-card--empty">
        <h2 class="quote-web-section__title">Cotización no encontrada</h2>
        <p class="quote-web-page__empty-copy">
          Esta vista depende de una cotización generada previamente en el cotizador del frontend.
        </p>
        <a class="quote-web-page__back-link" href="/cotizador">Volver al cotizador</a>
      </section>
    </main>

    <div class="quote-web-page__footer">
      <div class="quote-web-page__footer-inner">
        <a
          class="quote-web-page__confirm"
          :href="confirmWhatsappHref"
          :target="quote ? '_blank' : undefined"
          :rel="quote ? 'noopener noreferrer' : undefined"
          @click="handleConfirmWhatsappClick"
        >
          <i class="bi bi-whatsapp" aria-hidden="true"></i>
          <span>{{ quote ? 'Confirmar en un clic' : 'Ir al cotizador' }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.quote-web-page {
  min-height: 100vh;
  padding-bottom: 8rem;
  background:
    radial-gradient(circle at top center, rgba(var(--dm-accent-orange-rgb), 0.12), transparent 26%),
    linear-gradient(180deg, var(--dm-bg-0) 0%, var(--dm-bg-1) 100%);
  color: var(--dm-text-0);
}

.quote-web-page__spacer {
  height: 3rem;
}

.quote-web-page__content,
.quote-web-page__footer-inner {
  width: min(100%, 28rem);
  margin: 0 auto;
  padding-inline: 1.25rem;
}

.quote-web-page__content {
  display: grid;
  gap: 1.25rem;
}

.quote-web-page__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.quote-web-page__brand {
  margin: 0;
  color: rgb(var(--dm-accent-orange-rgb));
  font-size: 1.7rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.quote-web-page__subtitle,
.quote-web-card__client-contact,
.quote-web-page__validity,
.quote-web-page__empty-copy {
  margin: 0.35rem 0 0;
  color: rgba(var(--dm-text-0-rgb), 0.66);
}

.quote-web-page__status {
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  background: rgba(var(--dm-accent-orange-rgb), 0.12);
  color: rgb(var(--dm-accent-orange-rgb));
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.quote-web-card,
.quote-web-conditions__item {
  border: 1px solid rgba(var(--dm-text-0-rgb), 0.12);
  border-radius: 1.35rem;
  background: rgba(var(--dm-bg-0-rgb), 0.88);
  box-shadow: 0 0.75rem 2rem rgba(var(--dm-bg-0-rgb), 0.32);
}

.quote-web-card {
  padding: 1.25rem;
}

.quote-web-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.quote-web-label,
.quote-web-section__title,
.quote-web-pricing__deposit-label {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.7rem;
  font-weight: 800;
  color: rgba(var(--dm-text-0-rgb), 0.66);
}

.quote-web-card__mono {
  margin: 0.35rem 0 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 1.05rem;
  font-weight: 700;
}

.quote-web-card__corner-icon,
.quote-web-conditions__icon {
  color: rgba(var(--dm-text-0-rgb), 0.66);
  font-size: 1.4rem;
}

.quote-web-card__client-name {
  margin: 0.45rem 0 0;
  color: rgb(var(--dm-accent-orange-rgb));
  font-size: 1.5rem;
  font-weight: 700;
  font-style: italic;
}

.quote-web-section {
  display: grid;
  gap: 0.75rem;
}

.quote-web-conditions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.quote-web-conditions__item {
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 0.45rem;
  padding: 1rem 0.75rem;
}

.quote-web-conditions__label {
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  color: rgba(var(--dm-text-0-rgb), 0.66);
}

.quote-web-conditions__value,
.is-positive {
  color: rgba(var(--dm-whatsapp-green-rgb), 0.95);
  font-weight: 800;
  text-transform: uppercase;
}

.quote-web-pricing__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-block: 0.4rem;
  color: rgba(var(--dm-text-0-rgb), 0.82);
}

.quote-web-pricing__row--total {
  margin-top: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(var(--dm-text-0-rgb), 0.14);
}

.quote-web-pricing__row--total strong {
  font-size: 1.5rem;
}

.quote-web-pricing__deposit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem 1.1rem;
  border-radius: 1rem;
  background: rgb(var(--dm-accent-orange-rgb));
  color: white;
}

.quote-web-pricing__deposit-label {
  color: rgba(var(--dm-text-0-rgb), 0.76);
}

.quote-web-pricing__deposit-value {
  margin: 0.2rem 0 0;
  font-size: 1.35rem;
  font-weight: 800;
  font-style: italic;
}

.quote-web-page__validity {
  text-align: center;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.quote-web-card--empty {
  text-align: center;
}

.quote-web-page__back-link {
  display: inline-flex;
  margin-top: 1rem;
  color: rgb(var(--dm-accent-orange-rgb));
  font-weight: 700;
  text-decoration: none;
}

.quote-web-page__footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1.5rem 0 1.75rem;
  background: linear-gradient(180deg, rgba(var(--dm-bg-0-rgb), 0), rgba(var(--dm-bg-0-rgb), 0.96) 45%);
}

.quote-web-page__confirm {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  width: 100%;
  min-height: 3.75rem;
  border-radius: 1rem;
  background: rgba(var(--dm-whatsapp-green-rgb), 0.95);
  color: white;
  text-decoration: none;
  font-weight: 800;
  box-shadow: 0 1rem 2rem rgba(var(--dm-whatsapp-green-rgb), 0.2);
}

.quote-web-page__confirm i {
  font-size: 1.35rem;
}
</style>
