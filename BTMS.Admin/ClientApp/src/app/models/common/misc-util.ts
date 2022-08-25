import { AbstractControl, ValidationErrors } from "@angular/forms";

export class MiscUtil {
    public static passwordMatch(control : AbstractControl) : ValidationErrors | null
  {
     
    // NOTE Safety check
    if (!control.get('password')?.value || !control.get('confirmPassword')?.value)
      return null;

    // NOTE Compare fields
    // const mStart  = moment(control.get('startDate').value);
    // const mEnd    = moment(control.get('endDate').value);
     const isValid = control.get('password')?.value == control.get('confirmPassword')?.value;
    console.log('Valid: ' + isValid)
    // NOTE Invalid
    if (!isValid)
      return { noMatch : true };

    // NOTE Valid
    return null;
  }
}

