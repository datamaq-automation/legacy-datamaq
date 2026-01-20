export class ContactSubmitted {
  readonly name = 'contact.submitted'
  readonly occurredAt: Date

  constructor(readonly contactId: string) {
    this.occurredAt = new Date()
  }
}
