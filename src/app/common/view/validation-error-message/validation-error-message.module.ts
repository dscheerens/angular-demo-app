import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ValidationErrorMessageComponent } from './validation-error-message.component';

@NgModule({
    imports: [CommonModule],
    declarations: [ValidationErrorMessageComponent],
    exports: [ValidationErrorMessageComponent]
})
export class ValidationErrorMessageModule {

}
