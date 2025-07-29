import { Injectable } from '@nestjs/common'
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class PasswordValidator implements ValidatorConstraintInterface {
  constructor() { }

  async validate(value: string) {
    if (value?.match(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/)) {
      return true
    }
    return false
  }

  defaultMessage() {
    return `Password must contain at least 8 characters, one uppercase, one number and one special case character`
  }
}
