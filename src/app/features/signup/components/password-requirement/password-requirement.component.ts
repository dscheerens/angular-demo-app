import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-password-requirement',
    templateUrl: './password-requirement.component.html',
    styleUrls: ['./password-requirement.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordRequirementComponent {
    @Input() public satisfied?: boolean;
}
