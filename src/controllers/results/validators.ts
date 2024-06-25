import createHttpError from 'http-errors';
import type { ResultCreateBody } from 'src/types/routes/result';

export const ValidateCreateBody = (body: Partial<ResultCreateBody>) => {
    const { name } = body;

    if (!name) {
        throw createHttpError(400, 'Name required');
    }
    if (name.length < 2) {
        throw createHttpError(400, 'Name must be at least 2 characters long');
    }

    return body as ResultCreateBody;
};