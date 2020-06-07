import { Component, ChangeDetectionStrategy, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormGroup, FormControl, ValidatorFn } from 'ngx-typesafe-forms';
import { Observable, Subject, Subscription, merge } from 'rxjs';
import { distinctUntilChanged, map, filter, shareReplay, switchMap, startWith } from 'rxjs/operators';

import { createPasswordValidator } from '../../common/util/forms/password-validator';
import { CharacterGroups } from '../../common/util/strings/characters';
import { User, UserRepository } from '../../common/domain/users';
import { Loadable, mapToLoadable } from '../../common/util/rxjs/loadable';

@Component({
    selector: 'app-signup-feature',
    templateUrl: './signup-feature.component.html',
    styleUrls: ['./signup-feature.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupFeatureComponent implements OnInit, OnDestroy {

    public readonly formControls = (() => {
        const firstName = new FormControl<string>('', [Validators.required]);

        const lastName = new FormControl<string>('', [Validators.required]);

        const email = new FormControl<string>('', [Validators.required, Validators.email]);

        const passwordValidator = createPasswordValidator({
            minLength: 8,
            requiredCharacterGroups: [CharacterGroups.lowerCase, CharacterGroups.upperCase],
            disallowedTerms: () => [firstName.value, lastName.value]
        });
        const password = new FormControl<string>('', [Validators.required, passwordValidator]);

        const passwordConfirmValidator: ValidatorFn<string> =
            ({ value }) => value === password.value ? null : { doesNotMatchPassword: true };
        const passwordConfirm = new FormControl<string>('', [passwordConfirmValidator]);

        return { firstName, lastName, email, password, passwordConfirm };
    })();

    public readonly formGroup = new FormGroup(this.formControls);

    public createUser$!: Observable<Loadable<void>>;
    public formEnabled$!: Observable<boolean>;

    private readonly createUserSubject = new Subject<Observable<void>>();

    private readonly subscriptions = new Subscription();

    constructor(
        private readonly router: Router,
        private readonly userRepository: UserRepository
    ) { }

    public ngOnInit(): void {

        this.createUser$ = this.createUserSubject.pipe(
            switchMap((createUser$) => createUser$.pipe(mapToLoadable())),
            shareReplay({ bufferSize: 1, refCount: true })
        );

        this.formEnabled$ = this.createUser$.pipe(
            map(({ failed }) => failed),
            startWith(true),
            distinctUntilChanged()
        );

        this.subscriptions.add(
            merge(this.formControls.firstName.valueChanges, this.formControls.lastName.valueChanges)
                .subscribe(() => this.formControls.password.updateValueAndValidity())
        );

        this.subscriptions.add(
            this.formControls.password.valueChanges
                .subscribe(() => this.formControls.passwordConfirm.updateValueAndValidity())
        );

        this.subscriptions.add(
            this.formEnabled$
                .subscribe((enableForm) => {
                    if (enableForm && !this.formGroup.enabled) {
                        this.formGroup.enable();
                    }
                    if (!enableForm && this.formGroup.enabled) {
                        this.formGroup.disable();
                    }
                })
        );

        this.subscriptions.add(
            this.createUser$
                .pipe(filter(({ success }) => success))
                .subscribe(() => this.router.navigate(['welcome']))
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public signup(): void {
        const user = this.user;

        if (!user) {
            return;
        }

        this.createUserSubject.next(this.userRepository.createUser(user));
    }

    public get user(): User | undefined {
        if (this.formGroup.invalid) {
            return undefined;
        }

        const { firstName, lastName, email, password } = this.formGroup.value;

        return { firstName, lastName, email, password };
    }

}
