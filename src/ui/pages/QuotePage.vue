<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/ui/layout/Navbar.vue'
import Footer from '@/ui/layout/Footer.vue'
import ConsentBanner from '@/ui/features/contact/ConsentBanner.vue'
import WhatsAppFab from '@/ui/features/contact/WhatsAppFab.vue'
import type {
  DiagnosticQuoteRequest,
  DiagnosticQuoteResponse,
  QuoteBureaucracyLevel
} from '@/application/dto/quote'
import {
  summarizeDiagnosticQuoteRequest,
  summarizeDiagnosticQuoteResponse,
  summarizeQuoteError,
  summarizeQuotePdfDownload
} from '@/application/quote/quoteRuntimeDiagnostics'
import { QuoteApiError, type QuoteValidationIssue } from '@/application/quote/quoteApiError'
import { buildRuntimeLogArgs } from '@/application/utils/runtimeConsole'
import { getWhatsAppEnabled, getWhatsAppHref } from '@/ui/controllers/contactController'
import { createDiagnosticQuote, fetchQuotePdf } from '@/ui/controllers/quoteController'
import { saveQuoteWebSnapshot } from './quoteWebState'

type BinaryChoice = boolean | null
const QUOTE_FORM_FIELDS = [
  'company',
  'contact_name',
  'locality',
  'scheduled',
  'access_ready',
  'safe_window_confirmed',
  'bureaucracy',
  'email',
  'phone',
  'notes'
] as const
type QuoteFormField = (typeof QUOTE_FORM_FIELDS)[number]
const QUOTE_FORM_FIELDS_SET = new Set<string>(QUOTE_FORM_FIELDS)

interface QuoteFormState {
  company: string
  contact_name: string
  locality: string
  scheduled: BinaryChoice
  access_ready: BinaryChoice
  safe_window_confirmed: BinaryChoice
  bureaucracy: QuoteBureaucracyLevel | ''
  email: string
  phone: string
  notes: string
}

type QuoteFormErrors = Partial<Record<QuoteFormField, string>>

interface QuoteDiscountView {
  key: string
  label: string
  code: string
  amountText: string
}

const contactCtaEnabled = getWhatsAppEnabled()
const router = useRouter()
const fallbackWhatsAppUrl = computed(() => getWhatsAppHref() ?? '#contacto')
const isFallbackWhatsAppExternal = computed(() => /^https?:\/\//.test(fallbackWhatsAppUrl.value))

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
  phone: '',
  notes: ''
})

const errors = reactive<QuoteFormErrors>({})

const canDownloadPdf = computed(() => Boolean(quote.value?.quote_id))
const canOpenWhatsapp = computed(() => Boolean(quote.value?.whatsapp_url))
const canOpenWebView = computed(() => Boolean(quote.value?.quote_id))
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
    logQuoteUiWarn('generar propuesta validacion local fallo', {
      invalidFields: collectInvalidQuoteFields()
    })
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
      safe_window_confirmed: Boolean(form.safe_window_confirmed)
    }

    if (form.bureaucracy) {
      payload.bureaucracy = form.bureaucracy
    }

    const normalizedEmail = form.email.trim()
    const normalizedPhone = form.phone.trim()
    const normalizedNotes = form.notes.trim()
    if (normalizedEmail) {
      payload.email = normalizedEmail
    }
    if (normalizedPhone) {
      payload.phone = normalizedPhone
    }
    if (normalizedNotes) {
      payload.notes = normalizedNotes
    }

    logQuoteUiDebug('generar propuesta iniciado', {
      payload: summarizeDiagnosticQuoteRequest(payload)
    })
    quote.value = await createDiagnosticQuote(payload)
    saveQuoteWebSnapshot(quote.value)
    logQuoteUiInfo('generar propuesta OK', {
      quote: summarizeDiagnosticQuoteResponse(quote.value)
    })
  } catch (error) {
    logQuoteUiWarn('generar propuesta fallo', {
      error: summarizeQuoteError(error)
    })
    quote.value = undefined
    errorMessage.value = buildQuoteCreationErrorMessage(error)
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
    logQuoteUiDebug('descargar PDF iniciado', { quoteId })
    const result = await fetchQuotePdf(quoteId)
    logQuoteUiInfo('descargar PDF OK', {
      download: summarizeQuotePdfDownload(quoteId, result)
    })
    const { blob, filename } = result
    const safeFilename = filename?.trim() || `quote-${quoteId}.pdf`
    triggerFileDownload(blob, safeFilename)
  } catch (error) {
    logQuoteUiWarn('descargar PDF fallo', {
      quoteId,
      error: summarizeQuoteError(error)
    })
    errorMessage.value = buildQuotePdfErrorMessage(error)
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

function handleOpenWebView() {
  const currentQuote = quote.value
  if (!currentQuote) {
    return
  }
  saveQuoteWebSnapshot(currentQuote)
  void router.push({
    name: 'cotizador-web',
    params: {
      quoteId: currentQuote.quote_id
    }
  })
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
  QUOTE_FORM_FIELDS.forEach((field) => {
    delete errors[field]
  })
}

function collectInvalidQuoteFields(): QuoteFormField[] {
  return QUOTE_FORM_FIELDS.filter((field) => Boolean(errors[field]?.trim()))
}

function buildQuoteCreationErrorMessage(error: unknown): string {
  if (!QuoteApiError.is(error)) {
    return 'No pudimos generar la propuesta en este momento. Podes continuar por WhatsApp.'
  }

  if (error.status === 422) {
    const hasFieldErrors = applyBackendValidationErrors(error.validationIssues)
    if (hasFieldErrors) {
      return 'Revisa los campos marcados e intenta nuevamente.'
    }
    return normalizeText(error.detail) ?? 'No pudimos validar los datos enviados. Revisa el formulario.'
  }

  if (error.status === 429) {
    return buildRateLimitMessage(error.retryAfterSeconds, 'generar la propuesta')
  }

  return (
    normalizeText(error.detail) ??
    normalizeText(error.message) ??
    'No pudimos generar la propuesta en este momento. Podes continuar por WhatsApp.'
  )
}

function buildQuotePdfErrorMessage(error: unknown): string {
  if (!QuoteApiError.is(error)) {
    return 'No pudimos descargar el PDF. Proba nuevamente o escribinos por WhatsApp.'
  }

  if (error.status === 422) {
    return 'El identificador de la cotizacion no es valido.'
  }

  if (error.status === 404) {
    return 'La cotizacion no esta disponible para descarga.'
  }

  if (error.status === 429) {
    return buildRateLimitMessage(error.retryAfterSeconds, 'descargar el PDF')
  }

  return (
    normalizeText(error.detail) ??
    normalizeText(error.message) ??
    'No pudimos descargar el PDF. Proba nuevamente o escribinos por WhatsApp.'
  )
}

function applyBackendValidationErrors(validationIssues: QuoteValidationIssue[]): boolean {
  let hasFieldErrors = false

  validationIssues.forEach((issue) => {
    const field = resolveQuoteFormField(issue)
    if (!field) {
      return
    }
    errors[field] = issue.message
    hasFieldErrors = true
  })

  return hasFieldErrors
}

function resolveQuoteFormField(issue: QuoteValidationIssue): QuoteFormField | undefined {
  if (issue.field && isQuoteFormField(issue.field)) {
    return issue.field
  }

  for (let index = issue.loc.length - 1; index >= 0; index -= 1) {
    const segment = issue.loc[index]
    if (typeof segment === 'string' && isQuoteFormField(segment)) {
      return segment
    }
  }

  return undefined
}

function isQuoteFormField(value: string): value is QuoteFormField {
  return QUOTE_FORM_FIELDS_SET.has(value)
}

function buildRateLimitMessage(retryAfterSeconds: number | undefined, action: string): string {
  if (typeof retryAfterSeconds !== 'number') {
    return `Demasiadas solicitudes. Espera un momento y volve a intentar ${action}.`
  }

  const normalizedWait = Math.max(Math.ceil(retryAfterSeconds), 0)
  if (normalizedWait === 0) {
    return `Demasiadas solicitudes. Volve a intentar ${action} ahora.`
  }

  const unit = normalizedWait === 1 ? 'segundo' : 'segundos'
  return `Demasiadas solicitudes. Espera ${normalizedWait} ${unit} y volve a intentar ${action}.`
}

function normalizeText(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
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

function logQuoteUiDebug(event: string, context: Record<string, unknown>): void {
  if (!import.meta.env.DEV) {
    return
  }
  console.debug(...buildRuntimeLogArgs(`[quote:ui] ${event}`, context))
}

function logQuoteUiInfo(event: string, context: Record<string, unknown>): void {
  if (!import.meta.env.DEV) {
    return
  }
  console.info(...buildRuntimeLogArgs(`[quote:ui] ${event}`, context))
}

function logQuoteUiWarn(event: string, context: Record<string, unknown>): void {
  if (!import.meta.env.DEV) {
    return
  }
  console.warn(...buildRuntimeLogArgs(`[quote:ui] ${event}`, context))
}
</script>

<template>
  <div class="app-shell tw:bg-dm-bg tw:text-dm-text-0 tw:min-h-screen">
    <a class="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
    <Navbar :contactCtaEnabled="contactCtaEnabled" />

    <main id="contenido-principal" class="tw:flex-grow tw:py-16">
      <div class="tw:container tw:mx-auto tw:px-4">
        <section class="tw:mb-12">
          <p class="tw:uppercase tw:font-bold tw:text-sm tw:text-dm-primary tw:mb-2">Cotizador publico</p>
          <h1 class="tw:text-4xl tw:font-extrabold tw:mb-4">Propuesta tecnica en minutos</h1>
          <p class="tw:text-xl tw:text-dm-text-muted tw:max-w-2xl">
            Completa los datos minimos y generamos una propuesta premium con reserva y envio por WhatsApp.
          </p>
        </section>

        <div class="tw:grid tw:grid-cols-1 tw:lg:grid-cols-12 tw:gap-12 tw:items-start">
          <section class="tw:col-span-1 tw:lg:col-span-7" aria-labelledby="cotizador-form-title">
            <div class="tw:bg-dm-surface tw:border tw:border-dm-border tw:rounded-2xl tw:p-6 tw:lg:p-8">
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
                  <small v-if="errors.bureaucracy" class="text-danger">{{ errors.bureaucracy }}</small>
                </div>

                <div>
                  <label class="form-label fw-semibold" for="quote-email">Email (opcional)</label>
                  <input id="quote-email" v-model="form.email" class="form-control" type="email" />
                  <small v-if="errors.email" class="text-danger">{{ errors.email }}</small>
                </div>

                <div>
                  <label class="form-label fw-semibold" for="quote-phone">Telefono (opcional)</label>
                  <input id="quote-phone" v-model="form.phone" class="form-control" type="tel" />
                  <small v-if="errors.phone" class="text-danger">{{ errors.phone }}</small>
                </div>

                <div>
                  <label class="form-label fw-semibold" for="quote-notes">Notas (opcional)</label>
                  <textarea id="quote-notes" v-model="form.notes" class="form-control" rows="3"></textarea>
                  <small v-if="errors.notes" class="text-danger">{{ errors.notes }}</small>
                </div>

                <div class="d-flex flex-wrap gap-2 pt-2">
                  <button type="submit" class="tw:btn-primary tw:w-full tw:lg:w-auto" :disabled="loading">
                    {{ loading ? 'Generando...' : 'Generar propuesta' }}
                  </button>
                </div>
              </form>
            </div>
          </section>

          <aside class="tw:col-span-1 tw:lg:col-span-5" aria-live="polite">
            <div class="tw:bg-dm-surface tw:border tw:border-dm-border tw:rounded-2xl tw:p-6 tw:lg:p-8 tw:lg:sticky tw:lg:top-24">
              <h2 class="tw:text-xl tw:font-semibold tw:mb-4">Propuesta generada</h2>

              <p v-if="!quote" class="tw:text-dm-text-muted tw:mb-0">
                Al generar la propuesta vas a ver aqui el resumen premium con precio final, sena y vigencia.
              </p>

              <template v-else>
                <p class="mb-1"><strong>ID:</strong> {{ quote.quote_id }}</p>
                <p class="mb-1"><strong>Lista:</strong> {{ formatArs(quote.list_price_ars) }}</p>
                <p class="mb-1">
                  <strong>Descuentos ({{ quote.discount_pct }}%):</strong>
                  -{{ formatArs(quote.discount_total_ars) }}
                </p>
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
                    v-if="canOpenWebView"
                    type="button"
                    class="btn c-ui-btn c-ui-btn--outline"
                    @click="handleOpenWebView"
                  >
                    Ver version web
                  </button>
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
                <a
                  :href="fallbackWhatsAppUrl"
                  :target="isFallbackWhatsAppExternal ? '_blank' : undefined"
                  :rel="isFallbackWhatsAppExternal ? 'noopener noreferrer' : undefined"
                >
                  Consultar al WhatsApp
                </a>
              </div>

              <hr class="tw:my-8 tw:border-dm-border" />

              <ul class="mb-0 ps-3 text-white-50">
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
