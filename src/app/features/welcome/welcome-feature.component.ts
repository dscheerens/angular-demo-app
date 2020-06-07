import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-welcome-feature',
    templateUrl: './welcome-feature.component.html',
    styleUrls: ['./welcome-feature.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeFeatureComponent {

}
