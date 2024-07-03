import type { Response } from 'express';
import createHttpError from 'http-errors';

import { AppDataSource } from '../../data-source';
import { User } from '../../entities/user';
import type { UsersCreateRequest, UsersCreateResponse, UsersDeleteRequest, UsersDeleteResponse } from '../../types/routes/users';
import { validateCreateRequest, validateDeleteRequest } from './validators';
import type { UsersCreateBody, UsersUpdateRequest, UsersUpdateResponse } from '../../types/routes/users';

/**
 * Create a new user in the database
 */
const createUser = async (req: TypedRequestBody<UsersCreateRequest>, res: Response<UsersCreateResponse>) => {
    const { username, email, password, firstName, lastName } = validateCreateRequest(req.body);

    // Create a query runner to control the transactions, it allows to cancel the transaction if we need to
    const queryRunner = AppDataSource.createQueryRunner();

    // Connect the query runner to the database and start the transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const userRepo = queryRunner.manager.getRepository(User);
        const usernameExists = await userRepo.exist({
            where: { username }
        });
        if (usernameExists) {
            throw createHttpError(409, 'Username already exists');
        }

        const emailExists = await userRepo.exist({
            where: { email }
        });
        if (emailExists) {
            throw createHttpError(409, 'Email already exists');
        }

        const newUser = new User();
        newUser.username = username;
        newUser.email = email;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.setPassword(password);
        await queryRunner.manager.save(newUser);

        // No exceptions occured, so we commit the transaction
        await queryRunner.commitTransaction();

        res.send({ id: newUser.id });
    } catch (err) {
        // As an exception occured, cancel the transaction
        await queryRunner.rollbackTransaction();
        throw err;
    } finally {
        // We need to release the query runner to not keep a useless connection to the database
        await queryRunner.release();
    }
};

/**
 * Delete a user from the database by its ID
 */
const deleteUser = async (req: TypedRequestBody<UsersDeleteRequest>, res: Response<UsersDeleteResponse>) => {
    const id = validateDeleteRequest(req.params.id);

    const userRepo = AppDataSource.getRepository(User);
    
    const user = await userRepo.findOneBy({ id });
    if (!user) {
        throw createHttpError(400, 'User not found');
    }

    await userRepo.remove(user);

    res.send({ username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName });
};

const listUsers = async (req: Request, res: Response) => {
    const userRepo = AppDataSource.getRepository(User);
    
};

/**
 * Update a user's information in the database
 */
const updateUser = async (req: TypedRequestBody<UsersUpdateRequest>, res: Response<UsersUpdateResponse>) => {
    const { id, email, password, firstName, lastName } = validateUpdateRequest(req.body);

    // Create a query runner to control the transactions, it allows to cancel the transaction if we need to
    const queryRunner = AppDataSource.createQueryRunner();

    // Connect the query runner to the database and start the transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const userRepo = queryRunner.manager.getRepository(User);
        const user = await userRepo.findOne(id);
        if (!user) {
            throw createHttpError(404, 'User not found');
        }

        if (email) {
            const emailExists = await userRepo.exist({
                where: { email }
            });
            if (emailExists) {
                throw createHttpError(409, 'Email already exists');
            }
            user.email = email;
        }

        if (password) {
            user.setPassword(password);
        }

        if (firstName) {
            user.firstName = firstName;
        }

        if (lastName) {
            user.lastName = lastName;
        }

        await queryRunner.manager.save(user);

        // No exceptions occured, so we commit the transaction
        await queryRunner.commitTransaction();

        res.send({
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        });
    } catch (err) {
        // As an exception occured, cancel the transaction
        await queryRunner.rollbackTransaction();
        throw err;
    } finally {
        // We need to release the query runner to not keep a useless connection to the database
        await queryRunner.release();
    }
};


export default {
    createUser,
    updateUser,
    deleteUser
};
