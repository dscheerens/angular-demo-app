import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from 'ngx-typesafe-forms';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { observeProperty } from '../../util/rxjs/observe-property';

@Component({
    selector: 'app-validation-error-message',
    template: '{{ message$ | async }}',
    styles: [':host { display: inline; }'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidationErrorMessageComponent implements OnInit {
    @Input() public control?: FormControl<any>;
    @Input() public messages?: { [key: string]: string };
    public message$!: Observable<string | undefined>;

    public ngOnInit(): void {
        const control$ = observeProperty(this as ValidationErrorMessageComponent, 'control');
        const messages$ = observeProperty(this as ValidationErrorMessageComponent, 'messages');

        const errors$ = control$.pipe(
            switchMap((control) => control ? observeProperty(control, 'errors') : of(null)));

        this.message$ = combineLatest([errors$, messages$]).pipe(
            map(([errors, messages]) => {
                if (!errors || !messages) {
                    return undefined;
                }

                return Object.entries(messages).reduce<string | undefined>(
                    (result, [error, message]) => result ?? (error in errors ? message : undefined),
                    undefined
                );
            })
        );

    }
}
