import createHttpError from "http-errors";

import type { ResultCreateBody } from "src/types/routes/result"; 

export const ValidateCreateBody = (body: Partial<ResultCreateBody>) => {
    const { name, description, color } = body;

    if (!name) {
        throw createHttpError(400, "Name required");
    }
    if (name.length < 2) {
        throw createHttpError(400, "Name must be at least 2 characters long");
    }

    if (!color) {
        throw createHttpError(400, "Color required");
    }
    // Check if color is a valid hex color: #FABEBA
    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    const isInvalidColor = !hexColorRegex.test(color);
    if (isInvalidColor) {
        throw createHttpError(400, "Color must be a valid hex color");
    }

    return body as ResultCreateBody;
};