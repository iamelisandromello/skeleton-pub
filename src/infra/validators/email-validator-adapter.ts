import type { EmailValidator } from '@/validation/protocols'

import validator from 'validator'

export class EmailValidatorAdapter implements EmailValidator {
  async isValid(email: string): Promise<boolean> {
    try {
      return validator.isEmail(email)
    } catch (error) {
      return false
    }
  }
}
