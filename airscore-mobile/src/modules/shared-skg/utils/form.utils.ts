import {FormGroup} from "@angular/forms";

export function validateFormControls(form: FormGroup) {
  form.updateValueAndValidity();
  for (let formKey in form.controls) {
    form.controls[formKey].markAsDirty();
  }
}
