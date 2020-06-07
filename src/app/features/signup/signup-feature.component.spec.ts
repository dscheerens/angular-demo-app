import { Router } from '@angular/router';
import { createComponentFactory } from '@ngneat/spectator';
import { of, Subject } from 'rxjs';

import { UserRepository } from '../../common/domain/users';

import { SignupFeatureComponent } from './signup-feature.component';
import { SignupFeatureModule } from './signup-feature.module';

describe('signup feature component', () => {

    const createComponent = createComponentFactory({
        component: SignupFeatureComponent,
        mocks: [Router, UserRepository],
        imports: [SignupFeatureModule]
    });

    let spectator: ReturnType<typeof createComponent>;

    beforeEach(() => spectator = createComponent());

    it('intially shows no validation errors', () => {
        expect(spectator.queryAll('mat-error').length).toBe(0);
    });

    it('reveals the validation errors when clicking the submit button', () => {
        expect(spectator.queryAll('mat-error').length).toBe(0);

        spectator.click(submitButton());

        spectator.detectChanges();

        expect(spectator.queryAll('mat-error').length).toBe(4);
    });

    it('reveals the validation errors when fields are blurred', () => {
        spectator.focus(firstNameInput());
        spectator.detectChanges();
        spectator.blur(firstNameInput());
        spectator.detectChanges();

        expect(spectator.queryAll('mat-error').length).toBe(1);

        spectator.focus(passwordInput());
        spectator.detectChanges();
        spectator.blur(passwordInput());
        spectator.detectChanges();

        expect(spectator.queryAll('mat-error').length).toBe(2);
    });

    it('requires the password to be confirmed', () => {
        spectator.focus(passwordInput());
        spectator.typeInElement('VerySecurePassword123!', passwordInput());
        spectator.blur(passwordInput());
        spectator.detectChanges();

        expect(spectator.queryAll('mat-error').length).toBe(0);

        spectator.focus(passwordConfirmInput());
        spectator.blur(passwordConfirmInput());
        spectator.detectChanges();

        expect(spectator.queryAll('mat-error').length).toBe(1);

        spectator.focus(passwordConfirmInput());
        spectator.typeInElement('VerySecurePassword123!', passwordConfirmInput());
        spectator.blur(passwordConfirmInput());
        spectator.detectChanges();

        expect(spectator.queryAll('mat-error').length).toBe(0);

        spectator.focus(passwordInput());
        spectator.typeInElement('DecidedToChangeThePassword', passwordInput());
        spectator.blur(passwordInput());
        spectator.detectChanges();

        expect(spectator.queryAll('mat-error').length).toBe(1);
    });

    it('updates the password validity when the first and last name fields are changed', () => {
        spectator.focus(passwordInput());
        spectator.typeInElement('VerySecurePassword123!', passwordInput());
        spectator.blur(passwordInput());
        spectator.detectChanges();

        expect(spectator.queryAll('mat-error').length).toBe(0);

        spectator.focus(firstNameInput());
        spectator.typeInElement('secure', firstNameInput());
        spectator.blur(firstNameInput());
        spectator.detectChanges();

        expect(spectator.queryAll('mat-error').length).toBe(1);

        spectator.focus(passwordInput());
        spectator.typeInElement('ChangedItToASuperStrongPassphraseDontYouThink?', passwordInput());
        spectator.blur(passwordInput());
        spectator.detectChanges();

        expect(spectator.queryAll('mat-error').length).toBe(0);

        spectator.focus(lastNameInput());
        spectator.typeInElement('PASS', lastNameInput());
        spectator.blur(lastNameInput());
        spectator.detectChanges();

        expect(spectator.queryAll('mat-error').length).toBe(1);
    });

    it('does not create the user account when clicking the submit button while the form contains validation errors', () => {
        const userRepository = spectator.inject(UserRepository);

        userRepository.createUser.and.returnValue(of(undefined));

        spectator.click(submitButton());

        expect(userRepository.createUser).not.toHaveBeenCalled();
    });

    it('creates the user account when clicking the submit button and the form is valid', () => {
        fillFormFieldsWithValidValues();

        const userRepository = spectator.inject(UserRepository);

        userRepository.createUser.and.returnValue(of(undefined));

        spectator.click(submitButton());

        expect(userRepository.createUser).toHaveBeenCalledWith({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@test.com',
            password: 'YouWillNeverGuessThis!'
        });
    });

    it('shows a spinner while the user account is being created', () => {
        const result = new Subject<void>();

        fillFormFieldsWithValidValues();

        const userRepository = spectator.inject(UserRepository);

        userRepository.createUser.and.returnValue(result);

        spectator.click(submitButton());

        spectator.detectChanges();

        expect(createUserSpinnerIsVisible()).toBe(true);

        result.next(undefined);
        result.complete();

        spectator.detectChanges();

        expect(createUserSpinnerIsVisible()).toBe(false);
    });

    it('disables the form while the user account is being created', () => {
        const result = new Subject<void>();

        fillFormFieldsWithValidValues();

        const userRepository = spectator.inject(UserRepository);

        userRepository.createUser.and.returnValue(result);

        spectator.click(submitButton());

        spectator.detectChanges();

        expect(firstNameInput().disabled).toBe(true);
        expect(lastNameInput().disabled).toBe(true);
        expect(emailInput().disabled).toBe(true);
        expect(passwordInput().disabled).toBe(true);
        expect(passwordConfirmInput().disabled).toBe(true);
        expect(submitButton().disabled).toBe(true);
    });

    it('shows an error message if the user could not be created', () => {
        const result = new Subject<void>();

        fillFormFieldsWithValidValues();

        const userRepository = spectator.inject(UserRepository);

        userRepository.createUser.and.returnValue(result);

        spectator.click(submitButton());

        spectator.detectChanges();

        expect(createUserSpinnerIsVisible()).toBe(true);

        result.error(new Error('Server was too lazy to do some work'));

        spectator.detectChanges();

        expect(createUserSpinnerIsVisible()).toBe(false);
        expect(failedToCreateUserErrorMessageVisible()).toBe(true);
    });

    it('re-enables the form if the user account could not be created', () => {
        const result = new Subject<void>();

        fillFormFieldsWithValidValues();

        const userRepository = spectator.inject(UserRepository);

        userRepository.createUser.and.returnValue(result);

        spectator.click(submitButton());

        spectator.detectChanges();

        result.error(new Error('Server was too lazy to do some work'));

        spectator.detectChanges();

        expect(firstNameInput().disabled).toBe(false);
        expect(lastNameInput().disabled).toBe(false);
        expect(emailInput().disabled).toBe(false);
        expect(passwordInput().disabled).toBe(false);
        expect(passwordConfirmInput().disabled).toBe(false);
        expect(submitButton().disabled).toBe(false);
    });

    it('redirects to the welcome page after the user was successfully created', () => {
        fillFormFieldsWithValidValues();

        const userRepository = spectator.inject(UserRepository);
        const router = spectator.inject(Router);

        userRepository.createUser.and.returnValue(of(undefined));

        spectator.click(submitButton());

        expect(router.navigate).toHaveBeenCalledWith(['welcome']);
    });

    function submitButton(): HTMLButtonElement {
        return spectator.query('button[type="submit"]') ??
            (() => { throw new Error('Submit button was not found'); })();
    }

    function firstNameInput(): HTMLInputElement {
        return spectator.query('input[name="firstName"]') ??
            (() => { throw new Error('First name input field was not found'); })();
    }

    function lastNameInput(): HTMLInputElement {
        return spectator.query('input[name="lastName"]') ??
            (() => { throw new Error('Last name input field was not found'); })();
    }

    function emailInput(): HTMLInputElement {
        return spectator.query('input[name="email"]') ??
            (() => { throw new Error('Email input field was not found'); })();
    }

    function passwordInput(): HTMLInputElement {
        return spectator.query('input[name="password"]') ??
            (() => { throw new Error('Password input field was not found'); })();
    }

    function passwordConfirmInput(): HTMLInputElement {
        return spectator.query('input[name="passwordConfirm"]') ??
            (() => { throw new Error('Password confirm input field was not found'); })();
    }

    function createUserSpinnerIsVisible(): boolean {
        return spectator.query('.status-message.progress') !== null;
    }

    function failedToCreateUserErrorMessageVisible(): boolean {
        return spectator.query('.status-message.error') !== null;
    }

    function fillFormFieldsWithValidValues(): void {
        spectator.typeInElement('John', firstNameInput());
        spectator.typeInElement('Doe', lastNameInput());
        spectator.typeInElement('john.doe@test.com', emailInput());
        spectator.typeInElement('YouWillNeverGuessThis!', passwordInput());
        spectator.typeInElement('YouWillNeverGuessThis!', passwordConfirmInput());
    }

});
