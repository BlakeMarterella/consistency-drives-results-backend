import createHttpError from 'http-errors';
import type { ResultCreateBody } from 'src/types/routes/result';

export const ValidateCreateBody = (body: Partial<ResultCreateBody>) => {
    const { name } = body;

    if (!name) {
        throw createHttpError(400, 'Name required');
    }

    return body as ResultCreateBody;
};