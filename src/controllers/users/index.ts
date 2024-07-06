import type { Response } from 'express';
import createHttpError from 'http-errors';

import { AppDataSource } from '../../data-source';
import { User } from '../../entities/user';
import type { UsersCreateRequest, UsersCreateResponse, UsersDeleteRequest, UsersDeleteResponse, UsersListResponse, UsersUpdateRequest, UsersUpdateResponse } from '../../types/routes/users';
import { CommonValidator } from '../common/validator';
import ErrorMessages from '../common/errorMessages';
import { BasicValidator, AdvancedValidator } from './validators';

/**
 * Create a new user in the database
 */
const createUser = async (req: TypedRequestBody<UsersCreateRequest>, res: Response<UsersCreateResponse>) => {
    const { username, email, password, firstName, lastName } = BasicValidator.validateCreateRequest(req.body);

    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const userRepo = queryRunner.manager.getRepository(User);
        
        await AdvancedValidator.validateUniqueUsername(username, userRepo);
        await AdvancedValidator.validateUniqueEmail(email, userRepo);

        const newUser = new User();
        newUser.username = username;
        newUser.email = email;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.setPassword(password);
        await queryRunner.manager.save(newUser);

        await queryRunner.commitTransaction();

        res.send({ id: newUser.id });
    } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
    } finally {
        await queryRunner.release();
    }
};

/**
 * Delete a user from the database by its ID
 */
const deleteUser = async (req: TypedRequestBody<UsersDeleteRequest>, res: Response<UsersDeleteResponse>) => {
    const id = CommonValidator.validateUUID(req.params.id);

    const queryRunner = AppDataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const userRepo = queryRunner.manager.getRepository(User);
        
        const user = await AdvancedValidator.findUserById(id, userRepo);

        await userRepo.remove(user);
    
        res.send({ username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName });
    }
    catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
    }
    finally {
        await queryRunner.release();
    }
};

/**
 * List all users in the database
 */
const listUsers = async (req: TypedRequestBody<Request>, res: Response<UsersListResponse>) => {
    const queryRunner = AppDataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
   
    try {
        const userRepo = queryRunner.manager.getRepository(User);
        let users : User[] = await userRepo.find();
        users = users.map(user => {
            const updatedUser: User = user;
            updatedUser.createdAt = new Date(user.createdAt);
            updatedUser.updatedAt = new Date(user.updatedAt);
            return updatedUser;
        });
        res.send(users);
    }
    catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
    }
    finally {
        await queryRunner.release();
    }
};

/**
 * Update a user's information in the database
 */
const updateUser = async (req: TypedRequestBody<UsersUpdateRequest>, res: Response<UsersUpdateResponse>) => {
    const { email, firstName, lastName, username } = BasicValidator.validateUpdateRequest(req.body);
    const id = CommonValidator.validateUUID(req.params.id);

    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const userRepo = queryRunner.manager.getRepository(User);
        const user = await AdvancedValidator.findUserById(id, userRepo);
        if (email) {
            await AdvancedValidator.validateUniqueEmail(email, userRepo);
            user.email = email;
        }
        if (username) {
            await AdvancedValidator.validateUniqueUsername(username, userRepo);
            user.username = username;
        }
        if (firstName) {
            user.firstName = firstName;
        }
        if (lastName) {
            user.lastName = lastName;
        }

        await queryRunner.manager.save(user);
        await queryRunner.commitTransaction();
        
        res.send(user);
    } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
    } finally {
        await queryRunner.release();
    }
};

/**
 * Get a user's information from the database
 */
const getUser = async (req: TypedRequestBody<Request>, res: Response<UsersUpdateResponse>) => {
    const id = CommonValidator.validateUUID(req.params.id);

    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const userRepo = queryRunner.manager.getRepository(User);
        const user = await AdvancedValidator.findUserById(id, userRepo);

        res.send(user);
    } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
    } finally {
        await queryRunner.release();
    }
}

export default {
    createUser,
    updateUser,
    deleteUser,
    getUser,
    listUsers
};
