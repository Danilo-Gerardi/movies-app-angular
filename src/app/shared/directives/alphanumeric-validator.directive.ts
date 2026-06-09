import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

const ALPHANUMERIC_PATTERN = /^[a-zA-Z0-9\s]+$/;
const MIN_LENGTH = 3;

@Directive({
  selector: '[appAlphanumeric]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AlphanumericValidatorDirective,
      multi: true,
    },
  ],
})
export class AlphanumericValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return null;
    }

    const stringValue = String(value);
    const errors: ValidationErrors = {};

    if (stringValue.length < MIN_LENGTH) {
      errors['minlength'] = {
        requiredLength: MIN_LENGTH,
        actualLength: stringValue.length,
      };
    }

    if (!ALPHANUMERIC_PATTERN.test(stringValue)) {
      errors['alphanumeric'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }
}
