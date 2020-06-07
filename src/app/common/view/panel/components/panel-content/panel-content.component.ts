import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-panel-content',
    template: '<ng-content></ng-content>',
    styleUrls: ['./panel-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanelContentComponent { }
