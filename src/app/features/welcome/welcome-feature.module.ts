import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { PanelModule } from '../../common/view/panel';

import { WelcomeFeatureComponent } from './welcome-feature.component';

@NgModule({
    imports: [
        MatIconModule,

        PanelModule,

        RouterModule.forChild([
            { path: '', component: WelcomeFeatureComponent }
        ])
    ],
    declarations: [
        WelcomeFeatureComponent
    ]
})
export class WelcomeFeatureModule {

}
