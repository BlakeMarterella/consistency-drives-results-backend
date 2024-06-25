import createHttpError from 'http-errors';

export class CommonValidator {

    /**
     * Check if a color is in the proper hex format (with a # and 6 characters after it)
     * Ex: #FFFFFF
     * 
     * @param color a string representing a hex color to validate
     * @throws 400 if the color is not a valid hex color
     */
    static validateHexColor(color: string): void {
        const hexColorPattern = /^#[0-9A-F]{6}$/i;
        const isInvalidColor = !hexColorPattern.test(color);
        if (isInvalidColor) {
            throw createHttpError(400, 'Color must be a valid hex color');
        }
    }
}