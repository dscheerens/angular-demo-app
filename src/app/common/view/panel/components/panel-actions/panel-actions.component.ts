import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-panel-actions',
    template: '<ng-content></ng-content>',
    styleUrls: ['./panel-actions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanelActionsComponent { }
