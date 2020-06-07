export interface CharacterGroup {
    includes(character: string): boolean;
}

export const CharacterGroups = {
    upperCase: { includes: isUpperCaseCharacter },
    lowerCase: { includes: isLowerCaseCharacter }
};

export function isUpperCaseCharacter(character: string): boolean {
    return isLetter(character) && character.toUpperCase() === character;
}

export function isLowerCaseCharacter(character: string): boolean {
    return isLetter(character) && character.toLowerCase() === character;
}

export function isLetter(character: string): boolean {
    // Simplified implementation. Doesn't work correctly for scripts which do not differentiate between upper and lower case characters.
    return character.toLowerCase() !== character.toUpperCase();
}
