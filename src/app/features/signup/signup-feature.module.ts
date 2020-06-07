import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

import { PanelModule } from '../../common/view/panel';
import { ValidationErrorMessageModule } from '../../common/view/validation-error-message';

import { PasswordRequirementComponent } from './components/password-requirement/password-requirement.component';
import { SignupFeatureComponent } from './signup-feature.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,

        PanelModule,
        ValidationErrorMessageModule,

        RouterModule.forChild([
            { path: '', component: SignupFeatureComponent }
        ])
    ],
    declarations: [
        PasswordRequirementComponent,
        SignupFeatureComponent
    ]
})
export class SignupFeatureModule { }
