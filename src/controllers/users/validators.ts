import createHttpError from 'http-errors';
import isEmail from 'validator/lib/isEmail';

import type { UsersCreateRequest, UsersUpdateRequest } from '../../types/routes/users';
import ErrorMessages from '../common/errorMessages';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user';


/**
 * Validate the syntax of a user's input fields.
 */
export class BasicValidator {
    /**
     * Check that all the required fields are present in the request body.
     */
    static validateCreateRequest = (body: Partial<UsersCreateRequest>) => {
        const { username, email, password, firstName, lastName } = body;
    
        this.validateUsername(username);
        this.validateFirstName(firstName);
        this.validateLastName(lastName);
        this.validateEmail(email);
        this.validatePassword(password);
    
        return body as UsersCreateRequest;
    };
    
    /**
     * Check that all the required fields are present in the request body.
     */
    static validateUpdateRequest = (body: Partial<UsersUpdateRequest>) => {
        const { email, username } = body;
    
        // The fields below are optional, therefore only validate if present
        if (email) {
            this.validateEmail(email);
        }
        if (username) {
            this.validateUsername(username);
        }
    
        return body as UsersUpdateRequest;
    };

    private static validateUsername(username?: string) {
        if (!username) {
            throw createHttpError(400, ErrorMessages.MISSING_USERNAME);
        }
        if (username.length < 5) {
            throw createHttpError(400, ErrorMessages.USERNAME_TOO_SHORT);
        }
    }
    
    private static validateFirstName(firstName?: string) {
        if (!firstName) {
            throw createHttpError(400, ErrorMessages.MISSING_FIRST_NAME);
        }
    }
    
    private static validateLastName(lastName?: string) {
        if (!lastName) {
            throw createHttpError(400, ErrorMessages.MISSING_LAST_NAME);
        }
    }
    
    private static validateEmail(email?: string) {
        if (!email) {
            throw createHttpError(400, ErrorMessages.MISSING_EMAIL);
        }
        if (!isEmail(email)) {
            throw createHttpError(400, ErrorMessages.INVALID_EMAIL);
        }
    }
    
    private static validatePassword(password?: string) {
        if (!password) {
            throw createHttpError(400, ErrorMessages.MISSING_PASSWORD);
        }
        if (password.length < 8) {
            throw createHttpError(400, ErrorMessages.PASSWORD_TOO_SHORT);
        }
    }
}


/**
 * Validate the semantics of a request by checking the database.
 */
export class AdvancedValidator {
    /**
     * Validate that a given username does not already exist in the database.
     */
    static validateUniqueUsername = async (username: string, repo: Repository<User>) => {
        const usernameExists = await repo.findOne({
            where: { username }
        });
        if (usernameExists) {
            throw createHttpError(409, ErrorMessages.DUPLICATE_USERNAME);
        }
    };
    
    /**
     * Validate that a given email does not already exist in the database.
     */
    static validateUniqueEmail = async (email: string, repo: Repository<User>) => {
        const emailExists = await repo.findOne({
            where: { email }
        });
        if (emailExists) {
            throw createHttpError(409, ErrorMessages.DUPLICATE_EMAIL);
        }
    };

    /**
     * Validate that a given id exists in the database.
     * 
     * @throws 400 if the id does not exist
     * @returns The user object if it exists
     */
    static findUserById = async (id: string, repo: Repository<User>) => {
        const user = await repo.findOne({
            where: { id }
        });
        if (!user) {
            throw createHttpError(400, ErrorMessages.USER_NOT_FOUND);
        }
        return user;
    };
}