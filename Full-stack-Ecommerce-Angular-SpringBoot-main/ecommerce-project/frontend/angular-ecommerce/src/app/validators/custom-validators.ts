import { FormControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {

    static checkBlanksValidation(control: FormControl): ValidationErrors | null{

        if ((control.value != null) && (control.value.trim().length === 0)) {
            return { 'checkBlanksValidation': true };
        }
        else {
            return null;
        }
    }
}
