import createHttpError from 'http-errors';
import isEmail from 'validator/lib/isEmail';

import type { UsersCreateBody, UsersUpdateRequest } from '../../types/routes/users';

export const validateCreateBody = (body: Partial<UsersCreateBody>) => {
    const { username, email, password, firstName, lastName } = body;

    if (!username) {
        throw createHttpError(400, 'Username required');
    }
    if (username.length < 5) {
        throw createHttpError(400, 'Username must contain at least 5 characters');
    }

    if (!firstName) {
        throw createHttpError(400, 'First name required');
    }

    if (!lastName) {
        throw createHttpError(400, 'Last name required');
    }

    if (!email) {
        throw createHttpError(400, 'Email required');
    }
    if (!isEmail(email)) {
        throw createHttpError(400, 'Email is invalid');
    }

    if (!password) {
        throw createHttpError(400, 'Password required');
    }
    if (password.length < 8) {
        throw createHttpError(400, 'Password must contain at least 8 characters');
    }

    // As the function checked the properties are not missing,
    // return the body as original type
    return body as UsersCreateBody;
};

export const validateUpdateRequest = (body: Partial<UsersUpdateRequest>) => {
    const { id, email, password, firstName, lastName } = body;

    if (!id) {
        throw createHttpError(400, 'Id required');
    }

    if (email && !isEmail(email)) {
        throw createHttpError(400, 'Email is invalid');
    }

    if (password && password.length < 8) {
        throw createHttpError(400, 'Password must contain at least 8 characters');
    }

    return body as UsersUpdateRequest;
};