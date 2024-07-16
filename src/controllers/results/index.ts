import type { Response } from 'express';

import { AppDataSource } from '../../data-source';
import { Result } from '../../entities/result';
import type { ResultsCreateRequest, ResultsCreateResponse, ResultsDeleteRequest, ResultsDeleteResponse, ResultsUpdateRequest, ResultsUpdateResponse } from '../../types/routes/results';
import { AdvancedValidator, BasicValidator } from './validators';
import { User } from '../../entities/user';
import ErrorMessages from '../common/errorMessages';
import { CommonValidator } from '../common/validator';

/**
 * Create a new result in the database for a user
 */
export const createResult = async (req: TypedRequestBody<ResultsCreateRequest>, res: Response<ResultsCreateResponse>): Promise<void> => {
    const { userId, name, description } = BasicValidator.validateCreateRequest(req.body);
    
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    
    try {
        await AdvancedValidator.findUserById(userId, queryRunner.manager.getRepository(User));
        
        await queryRunner.startTransaction();
        
        const resultRepo = queryRunner.manager.getRepository(Result);
        const newResult = new Result();
        newResult.user = new User();
        newResult.user.id = userId;
        newResult.name = name;
        newResult.description = description;
        await resultRepo.save(newResult);

        await queryRunner.commitTransaction();

        res.send({ id: newResult.id });
    } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
    } finally {
        await queryRunner.release();
    }
};

/**
 * Delete a result
 */
export const deleteResult = async (req: TypedRequestBody<ResultsDeleteRequest>, res: Response<ResultsDeleteResponse>): Promise<void> => {
    const id = CommonValidator.validateId(req.params.id);

    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const resultRepo = queryRunner.manager.getRepository(Result);        
        const result = await AdvancedValidator.findResultById(id, resultRepo);

        await resultRepo.remove(result);

        await queryRunner.commitTransaction();

        res.send({
            id: result.id,
            userId: result.user.id,
            name: result.name,
        });
    } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
    } finally {
        await queryRunner.release();
    }
};

/**
 * Update a result
 */
export const updateResult = async (req: TypedRequestBody<ResultsUpdateRequest>, res: Response<ResultsUpdateResponse>): Promise<void> => {
    const { name, description } = BasicValidator.validateUpdateRequest(req.body);
    const id = CommonValidator.validateId(req.params.id);

    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const resultRepo = queryRunner.manager.getRepository(Result);
        const result = await AdvancedValidator.findResultById(id, resultRepo);

        if (name) {
            result.name = name;
        }
        if (description) {
            result.description = description;
        }

        await resultRepo.save(result);
        await queryRunner.commitTransaction();

        res.send(result);
    } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
    } finally {
        await queryRunner.release();
    }
};

export default {
    createResult,
    deleteResult
};