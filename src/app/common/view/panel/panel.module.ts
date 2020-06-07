import { NgModule } from '@angular/core';

import { PanelComponent } from './components/panel/panel.component';
import { PanelTitleComponent } from './components/panel-title/panel-title.component';
import { PanelContentComponent } from './components/panel-content/panel-content.component';
import { PanelActionsComponent } from './components/panel-actions/panel-actions.component';

@NgModule({
    declarations: [
        PanelComponent,
        PanelTitleComponent,
        PanelContentComponent,
        PanelActionsComponent
    ],
    exports: [
        PanelComponent,
        PanelContentComponent,
        PanelTitleComponent,
        PanelActionsComponent
    ]
})
export class PanelModule { }
