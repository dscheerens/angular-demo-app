import { ValidatorFn } from 'ngx-typesafe-forms';

import { CharacterGroup } from '../strings/characters';

export interface PasswordValidatorOptions {
    disallowedTerms?: string[] | (() => string[]);
    requiredCharacterGroups?: CharacterGroup[];
    minLength?: number;
}

export function createPasswordValidator(options: PasswordValidatorOptions): ValidatorFn<string> {
    return (passwordControl) => {
        const password = passwordControl.value;
        const normalizedPassword = password.toLowerCase();
        const passwordCharacters = Array.from(password);

        const minLength = !!options.minLength && password.length < options.minLength;

        const requiredCharacterGroups = options.requiredCharacterGroups ?? [];
        const missingRequiredCharacterGroup = !requiredCharacterGroups.every((characterGroup) =>
            passwordCharacters.some((character) => characterGroup.includes(character))
        );

        const disallowedTerms = (typeof options.disallowedTerms === 'function' ? options.disallowedTerms() : options.disallowedTerms ?? [])
            .filter(({ length }) => length > 0)
            .map((term) => term.toLowerCase());
        const hasDisallowedTerms = disallowedTerms.some((term) => normalizedPassword.includes(term));

        const errors = { minLength, missingRequiredCharacterGroup, hasDisallowedTerms };

        return Object.values(errors).some((isError) => isError) ? { password: errors } : null;
    };
}
