import { z } from 'zod'

export const EmailContactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  company: z.string().max(160).optional(),
  message: z.string().max(1200).optional()
})

export type EmailContactInput = z.infer<typeof EmailContactSchema>
