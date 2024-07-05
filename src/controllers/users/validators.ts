import createHttpError from 'http-errors';
import isEmail from 'validator/lib/isEmail';

import type { UsersCreateRequest, UsersUpdateRequest } from '../../types/routes/users';

export const validateCreateRequest = (body: Partial<UsersCreateRequest>) => {
    const { username, email, password, firstName, lastName } = body;

    validateUsername(username);
    validateFirstName(firstName);
    validateLastName(lastName);
    validateEmail(email);
    validatePassword(password);

    return body as UsersCreateRequest;
};

export const validateUpdateRequest = (body: Partial<UsersUpdateRequest>) => {
    const { email } = body;

    if (email && !isEmail(email)) {
        throw createHttpError(400, 'Email is invalid');
    }

    return body as UsersUpdateRequest;
};


function validateUsername(username?: string) {
    if (!username) {
        throw createHttpError(400, 'Username required');
    }
    if (username.length < 5) {
        throw createHttpError(400, 'Username must contain at least 5 characters');
    }
}

function validateFirstName(firstName?: string) {
    if (!firstName) {
        throw createHttpError(400, 'First name required');
    }
}

function validateLastName(lastName?: string) {
    if (!lastName) {
        throw createHttpError(400, 'Last name required');
    }
}

function validateEmail(email?: string) {
    if (!email) {
        throw createHttpError(400, 'Email required');
    }
    if (!isEmail(email)) {
        throw createHttpError(400, 'Email is invalid');
    }
}

function validatePassword(password?: string) {
    if (!password) {
        throw createHttpError(400, 'Password required');
    }
    if (password.length < 8) {
        throw createHttpError(400, 'Password must contain at least 8 characters');
    }
}