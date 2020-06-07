import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-panel-title',
    template: '<ng-content></ng-content>',
    styleUrls: ['./panel-title.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanelTitleComponent { }
