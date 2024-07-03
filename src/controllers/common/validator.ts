import createHttpError from 'http-errors';

export class CommonValidator {

    /**
     * Check if a color is in the proper hex format (with a # and 6 characters after it)
     * Ex: #FFFFFF
     * 
     * @param color a string representing a hex color to validate
     * @throws 400 if the color is not a valid hex color
     */
    static isValidHexColor(color: string): boolean {
        const hexColorPattern = /^#[0-9A-F]{6}$/i;
        return hexColorPattern.test(color);
    }

    /**
     * In order for a UUID to be valid in TypeORM and PostGres it must:
     * - Contain 32 characters
     * - Only contain hexidecimal values
     * - Be in the proper format: xxxxxxxx-xxxx-xxxx-xxxx-xxxx
     * 
     * This function will allow you to catch malformed UUID's to throw
     * a custom exception earlier in the code-path.
     * 
     * @param uuid The unique identifier to check
     */
    static isValidUUID(uuid: string): boolean {
        // Regex to test for: xxxxxxxx-xxxx-xxxx-xxxx-xxxx
        const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return UUID_REGEX.test(uuid);
    }
}