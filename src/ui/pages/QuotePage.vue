<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import Navbar from '@/ui/layout/Navbar.vue'
import Footer from '@/ui/layout/Footer.vue'
import ConsentBanner from '@/ui/features/contact/ConsentBanner.vue'
import WhatsAppFab from '@/ui/features/contact/WhatsAppFab.vue'
import type {
  DiagnosticQuoteRequest,
  DiagnosticQuoteResponse,
  QuoteBureaucracyLevel
} from '@/application/dto/quote'
import { createDiagnosticQuote, fetchQuotePdf } from '@/infrastructure/quote/quoteApiGateway'
import { getWhatsAppEnabled, getWhatsAppHref } from '@/ui/controllers/contactController'

type BinaryChoice = boolean | null

interface QuoteFormState {
  company: string
  contact_name: string
  locality: string
  scheduled: BinaryChoice
  access_ready: BinaryChoice
  safe_window_confirmed: BinaryChoice
  bureaucracy: QuoteBureaucracyLevel
  email: string
  notes: string
}

interface QuoteFormErrors {
  company?: string
  contact_name?: string
  locality?: string
  scheduled?: string
  access_ready?: string
  safe_window_confirmed?: string
}

interface QuoteDiscountView {
  key: string
  label: string
  code: string
  amountText: string
}

const contactCtaEnabled = getWhatsAppEnabled()
const fallbackWhatsAppUrl = computed(() => getWhatsAppHref() ?? 'https://wa.me/5491156297160')

const loading = ref(false)
const pdfLoading = ref(false)
const errorMessage = ref<string | undefined>(undefined)
const quote = ref<DiagnosticQuoteResponse | undefined>(undefined)

const form = reactive<QuoteFormState>({
  company: '',
  contact_name: '',
  locality: '',
  scheduled: null,
  access_ready: null,
  safe_window_confirmed: null,
  bureaucracy: 'medium',
  email: '',
  notes: ''
})

const errors = reactive<QuoteFormErrors>({})

const canDownloadPdf = computed(() => Boolean(quote.value?.quote_id))
const canOpenWhatsapp = computed(() => Boolean(quote.value?.whatsapp_url))
const normalizedDiscounts = computed<QuoteDiscountView[]>(() => {
  const discounts = quote.value?.discounts ?? []
  return discounts.map((discount, index) => ({
    key: `${discount.code || 'discount'}-${index}`,
    label: discount.label?.trim() || 'Descuento',
    code: discount.code?.trim() || 'N/A',
    amountText: formatArsSafe(discount.amount_ars)
  }))
})

async function handleGenerateQuote() {
  clearErrors()
  errorMessage.value = undefined

  if (!validateForm()) {
    return
  }

  loading.value = true
  try {
    const payload: DiagnosticQuoteRequest = {
      company: form.company.trim(),
      contact_name: form.contact_name.trim(),
      locality: form.locality.trim(),
      scheduled: Boolean(form.scheduled),
      access_ready: Boolean(form.access_ready),
      safe_window_confirmed: Boolean(form.safe_window_confirmed),
      bureaucracy: form.bureaucracy
    }

    const normalizedEmail = form.email.trim()
    const normalizedNotes = form.notes.trim()
    if (normalizedEmail) {
      payload.email = normalizedEmail
    }
    if (normalizedNotes) {
      payload.notes = normalizedNotes
    }

    quote.value = await createDiagnosticQuote(payload)
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[cotizador] error al generar propuesta', error)
    }
    quote.value = undefined
    errorMessage.value =
      'No pudimos generar la propuesta en este momento. Podes continuar por WhatsApp.'
  } finally {
    loading.value = false
  }
}

async function handleDownloadPdf() {
  const quoteId = quote.value?.quote_id
  if (!quoteId) {
    return
  }

  pdfLoading.value = true
  errorMessage.value = undefined
  try {
    const { blob, filename } = await fetchQuotePdf(quoteId)
    const safeFilename = filename?.trim() || `quote-${quoteId}.pdf`
    triggerFileDownload(blob, safeFilename)
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[cotizador] error al descargar PDF', { quoteId, error })
    }
    errorMessage.value = 'No pudimos descargar el PDF. Proba nuevamente o escribinos por WhatsApp.'
  } finally {
    pdfLoading.value = false
  }
}

function handleOpenWhatsapp() {
  const whatsappUrl = quote.value?.whatsapp_url
  if (!whatsappUrl || typeof window === 'undefined') {
    return
  }
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
}

function validateForm(): boolean {
  let valid = true

  if (!form.company.trim()) {
    errors.company = 'Ingresa la empresa.'
    valid = false
  }
  if (!form.contact_name.trim()) {
    errors.contact_name = 'Ingresa el nombre de contacto.'
    valid = false
  }
  if (!form.locality.trim()) {
    errors.locality = 'Ingresa la localidad.'
    valid = false
  }
  if (form.scheduled === null) {
    errors.scheduled = 'Selecciona Si o No.'
    valid = false
  }
  if (form.access_ready === null) {
    errors.access_ready = 'Selecciona Si o No.'
    valid = false
  }
  if (form.safe_window_confirmed === null) {
    errors.safe_window_confirmed = 'Selecciona Si o No.'
    valid = false
  }

  return valid
}

function clearErrors(): void {
  delete errors.company
  delete errors.contact_name
  delete errors.locality
  delete errors.scheduled
  delete errors.access_ready
  delete errors.safe_window_confirmed
}

function setBinaryChoice(field: 'scheduled' | 'access_ready' | 'safe_window_confirmed', value: boolean) {
  form[field] = value
}

function formatArs(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(value)
}

function formatArsSafe(value: unknown): string {
  const numericValue =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number(value)
        : Number.NaN

  if (!Number.isFinite(numericValue)) {
    return '$ 0'
  }
  return formatArs(numericValue)
}

function formatDateTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

function triggerFileDownload(blob: Blob, filename: string): void {
  if (typeof window === 'undefined') {
    return
  }
  const objectUrl = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  window.URL.revokeObjectURL(objectUrl)
}
</script>

<template>
  <div class="app-shell bg-dark text-white min-vh-100">
    <a class="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
    <Navbar :contactCtaEnabled="contactCtaEnabled" />

    <main id="contenido-principal" class="flex-grow-1 with-floating-cta py-5">
      <div class="container">
        <section class="quote-hero mb-4 mb-lg-5">
          <p class="quote-eyebrow mb-2">Cotizador publico</p>
          <h1 class="display-6 fw-bold mb-3">Propuesta tecnica en minutos</h1>
          <p class="lead text-white-50 mb-0">
            Completa los datos minimos y generamos una propuesta premium con reserva y envio por WhatsApp.
          </p>
        </section>

        <div class="row g-4 align-items-start">
          <section class="col-lg-7" aria-labelledby="cotizador-form-title">
            <div class="quote-card">
              <h2 id="cotizador-form-title" class="h4 fw-semibold mb-3">Datos del servicio</h2>

              <form class="d-flex flex-column gap-3" @submit.prevent="handleGenerateQuote">
                <div>
                  <label class="form-label fw-semibold" for="quote-company">Empresa *</label>
                  <input id="quote-company" v-model="form.company" class="form-control" type="text" />
                  <small v-if="errors.company" class="text-danger">{{ errors.company }}</small>
                </div>

                <div>
                  <label class="form-label fw-semibold" for="quote-contact-name">Nombre de contacto *</label>
                  <input id="quote-contact-name" v-model="form.contact_name" class="form-control" type="text" />
                  <small v-if="errors.contact_name" class="text-danger">{{ errors.contact_name }}</small>
                </div>

                <div>
                  <label class="form-label fw-semibold" for="quote-locality">Localidad *</label>
                  <input id="quote-locality" v-model="form.locality" class="form-control" type="text" />
                  <small v-if="errors.locality" class="text-danger">{{ errors.locality }}</small>
                </div>

                <div>
                  <label class="form-label fw-semibold d-block mb-2">Turno agendado *</label>
                  <div class="d-flex gap-2">
                    <button
                      type="button"
                      class="btn btn-sm"
                      :class="form.scheduled === true ? 'btn-success' : 'btn-outline-light'"
                      @click="setBinaryChoice('scheduled', true)"
                    >
                      Si
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm"
                      :class="form.scheduled === false ? 'btn-success' : 'btn-outline-light'"
                      @click="setBinaryChoice('scheduled', false)"
                    >
                      No
                    </button>
                  </div>
                  <small v-if="errors.scheduled" class="text-danger">{{ errors.scheduled }}</small>
                </div>

                <div>
                  <label class="form-label fw-semibold d-block mb-2">Acceso preparado *</label>
                  <div class="d-flex gap-2">
                    <button
                      type="button"
                      class="btn btn-sm"
                      :class="form.access_ready === true ? 'btn-success' : 'btn-outline-light'"
                      @click="setBinaryChoice('access_ready', true)"
                    >
                      Si
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm"
                      :class="form.access_ready === false ? 'btn-success' : 'btn-outline-light'"
                      @click="setBinaryChoice('access_ready', false)"
                    >
                      No
                    </button>
                  </div>
                  <small v-if="errors.access_ready" class="text-danger">{{ errors.access_ready }}</small>
                </div>

                <div>
                  <label class="form-label fw-semibold d-block mb-2">Ventana segura confirmada *</label>
                  <div class="d-flex gap-2">
                    <button
                      type="button"
                      class="btn btn-sm"
                      :class="form.safe_window_confirmed === true ? 'btn-success' : 'btn-outline-light'"
                      @click="setBinaryChoice('safe_window_confirmed', true)"
                    >
                      Si
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm"
                      :class="form.safe_window_confirmed === false ? 'btn-success' : 'btn-outline-light'"
                      @click="setBinaryChoice('safe_window_confirmed', false)"
                    >
                      No
                    </button>
                  </div>
                  <small v-if="errors.safe_window_confirmed" class="text-danger">
                    {{ errors.safe_window_confirmed }}
                  </small>
                </div>

                <div>
                  <label class="form-label fw-semibold" for="quote-bureaucracy">Burocracia</label>
                  <select id="quote-bureaucracy" v-model="form.bureaucracy" class="form-select">
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>

                <div>
                  <label class="form-label fw-semibold" for="quote-email">Email (opcional)</label>
                  <input id="quote-email" v-model="form.email" class="form-control" type="email" />
                </div>

                <div>
                  <label class="form-label fw-semibold" for="quote-notes">Notas (opcional)</label>
                  <textarea id="quote-notes" v-model="form.notes" class="form-control" rows="3" />
                </div>

                <div class="d-flex flex-wrap gap-2 pt-2">
                  <button type="submit" class="btn c-ui-btn c-ui-btn--primary" :disabled="loading">
                    {{ loading ? 'Generando...' : 'Generar propuesta' }}
                  </button>
                </div>
              </form>
            </div>
          </section>

          <aside class="col-lg-5" aria-live="polite">
            <div class="quote-card quote-card--summary">
              <h2 class="h4 fw-semibold mb-3">Propuesta generada</h2>

              <p v-if="!quote" class="text-white-50 mb-0">
                Al generar la propuesta vas a ver aqui el resumen premium con precio final, sena y vigencia.
              </p>

              <template v-else>
                <p class="mb-1"><strong>ID:</strong> {{ quote.quote_id }}</p>
                <p class="mb-1"><strong>Lista:</strong> {{ formatArs(quote.list_price_ars) }}</p>
                <p class="mb-1"><strong>Final:</strong> {{ formatArs(quote.final_price_ars) }}</p>
                <p class="mb-1"><strong>Sena ({{ quote.deposit_pct }}%):</strong> {{ formatArs(quote.deposit_ars) }}</p>
                <p class="mb-3"><strong>Valida hasta:</strong> {{ formatDateTime(quote.valid_until) }}</p>

                <div v-if="normalizedDiscounts.length" class="mb-3">
                  <p class="fw-semibold mb-2">Descuentos aplicados</p>
                  <ul class="mb-0 ps-3">
                    <li v-for="discount in normalizedDiscounts" :key="discount.key">
                      {{ discount.label }} ({{ discount.code }}): -{{ discount.amountText }}
                    </li>
                  </ul>
                </div>

                <div class="d-flex flex-wrap gap-2">
                  <button
                    v-if="canDownloadPdf"
                    type="button"
                    class="btn c-ui-btn c-ui-btn--outline"
                    :disabled="pdfLoading"
                    @click="handleDownloadPdf"
                  >
                    {{ pdfLoading ? 'Descargando...' : 'Descargar PDF' }}
                  </button>
                  <button
                    v-if="canOpenWhatsapp"
                    type="button"
                    class="btn btn-success"
                    @click="handleOpenWhatsapp"
                  >
                    Enviar por WhatsApp
                  </button>
                </div>
              </template>

              <div v-if="errorMessage" class="alert alert-warning mt-3 mb-0" role="alert">
                <p class="mb-2">{{ errorMessage }}</p>
                <a :href="fallbackWhatsAppUrl" target="_blank" rel="noopener noreferrer">
                  Consultar al WhatsApp
                </a>
              </div>

              <hr class="my-4 border-secondary-subtle" />

              <ul class="quote-copy mb-0 ps-3">
                <li>Sena 50% para reservar agenda</li>
                <li>1 reprogramacion sin costo con 24h</li>
                <li>No-show: sena se pierde / Seguridad primero</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>

    <Footer :contactCtaEnabled="contactCtaEnabled" />
    <ConsentBanner />
    <WhatsAppFab />
  </div>
</template>

<style scoped>
.quote-eyebrow {
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--dm-line-blueprint);
  font-size: 0.8rem;
  font-weight: 700;
}

.quote-card {
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(17, 24, 39, 0.95));
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 1rem;
  padding: 1.25rem;
  backdrop-filter: blur(2px);
}

.quote-card--summary {
  position: sticky;
  top: 6rem;
}

.quote-copy {
  color: rgba(255, 255, 255, 0.85);
}

@media (max-width: 991.98px) {
  .quote-card--summary {
    position: static;
  }
}
</style>
