import { ValidationErrors } from '@angular/forms';

import { CharacterGroups } from '../strings/characters';

import { PasswordValidatorOptions, createPasswordValidator } from './password-validator';

function validate(password: string, validationOptions: PasswordValidatorOptions): ValidationErrors | null {
    const validatePassword = createPasswordValidator(validationOptions);

    return validatePassword({ value: password } as any);
}

function passwordValidationError(
    minLength: boolean,
    missingRequiredCharacterGroup: boolean,
    hasDisallowedTerms: boolean
): { password: { minLength: boolean; missingRequiredCharacterGroup: boolean; hasDisallowedTerms: boolean } } {
    return { password: { minLength, missingRequiredCharacterGroup, hasDisallowedTerms } };
}

describe('password validator', () => {
    it('supports minimum length validation', () => {
        expect(validate('', { minLength: 5 })).toEqual(passwordValidationError(true, false, false));

        expect(validate('abcd', { minLength: 5 })).toEqual(passwordValidationError(true, false, false));

        expect(validate('12345', { minLength: 5 })).toBeNull();

        expect(validate('12345abcde', { minLength: 5 })).toBeNull();
    });

    it('supports character group validation', () => {
        expect(validate('', { requiredCharacterGroups: [] })).toEqual(null);

        expect(validate('', { requiredCharacterGroups: [CharacterGroups.lowerCase] }))
            .toEqual(passwordValidationError(false, true, false));

        expect(validate('ABC', { requiredCharacterGroups: [CharacterGroups.lowerCase] }))
            .toEqual(passwordValidationError(false, true, false));

        expect(validate('AbC', { requiredCharacterGroups: [CharacterGroups.lowerCase] }))
            .toEqual(null);

        expect(validate('123abc', { requiredCharacterGroups: [CharacterGroups.lowerCase, CharacterGroups.upperCase] }))
            .toEqual(passwordValidationError(false, true, false));

        expect(validate('123abcDEF', { requiredCharacterGroups: [CharacterGroups.lowerCase, CharacterGroups.upperCase] }))
            .toEqual(null);
    });

    it('supports disallowed terms validation', () => {
        expect(validate('', { disallowedTerms: ['foo', 'bar'] })).toEqual(null);

        expect(validate('foba', { disallowedTerms: ['foo', 'bar'] })).toEqual(null);

        expect(validate('barf', { disallowedTerms: ['foo', 'bar'] })).toEqual(passwordValidationError(false, false, true));

        expect(validate('baFoo', { disallowedTerms: ['foo', 'bar'] })).toEqual(passwordValidationError(false, false, true));

        expect(validate('No evil terms!', { disallowedTerms: () => ['a', 'b', 'c'] })).toEqual(null);

        expect(validate('Too bad!', { disallowedTerms: () => ['a', 'b', 'c'] })).toEqual(passwordValidationError(false, false, true));
    });

    it('supports mixed validations', () => {
        expect(validate('bad pw', {
            minLength: 8,
            requiredCharacterGroups: [CharacterGroups.lowerCase, CharacterGroups.upperCase],
            disallowedTerms: ['bad']
        })).toEqual(passwordValidationError(true, true, true));

        expect(validate('better password', {
            minLength: 8,
            requiredCharacterGroups: [CharacterGroups.lowerCase, CharacterGroups.upperCase],
            disallowedTerms: ['password']
        })).toEqual(passwordValidationError(false, true, true));

        expect(validate('Okayish password', {
            minLength: 8,
            requiredCharacterGroups: [CharacterGroups.lowerCase, CharacterGroups.upperCase],
            disallowedTerms: ['password']
        })).toEqual(passwordValidationError(false, false, true));

        expect(validate('Good Password! (well not for an actual password, but at least for this test case)', {
            minLength: 8,
            requiredCharacterGroups: [CharacterGroups.lowerCase, CharacterGroups.upperCase],
            disallowedTerms: ['bad']
        })).toEqual(null);
    });

});
