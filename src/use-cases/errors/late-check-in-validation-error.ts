export class LateCheckInValidationError extends Error {
  constructor() {
    super("Check-in can only be validated until 20 minutes.");
  }
}