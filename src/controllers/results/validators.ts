import createHttpError from "http-errors";

import type { ResultCreateBody } from "src/types/routes/result"; 

export const ValidateCreateBody = (body: Partial<ResultCreateBody>) => {
    const { name, description, color } = body;

    if (!name) {
        throw createHttpError(400, "Name required");
    }
    if (name.length < 5) {
        throw createHttpError(400, "Name must contain at least 5 characters");
    }

    if (!description) {
        throw createHttpError(400, "Description required");
    }
    if (description.length < 5) {
        throw createHttpError(400, "Description must contain at least 5 characters");
    }

    if (!color) {
        throw createHttpError(400, "Color required");
    }
    if (color.length < 5) {
        throw createHttpError(400, "Color must contain at least 5 characters");
    }

    return body as ResultCreateBody;
};