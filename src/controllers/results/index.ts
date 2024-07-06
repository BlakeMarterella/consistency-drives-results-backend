import type { Response } from 'express';

import { AppDataSource } from '../../data-source';
import { Result } from '../../entities/result';
import type { ResultsCreateRequest, ResultsCreateResponse } from '../../types/routes/results';
import { AdvancedValidator, BasicValidator } from './validators';
import { User } from '../../entities/user';
  
export const createResult = async (req: TypedRequestBody<ResultsCreateRequest>, res: Response<ResultsCreateResponse>): Promise<void> => {
    const { userId, name, description } = BasicValidator.validateCreateRequest(req.body);
    
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const resultRepo = queryRunner.manager.getRepository(Result);

        const newResult = new Result();
        await AdvancedValidator.findUserById(userId, queryRunner.manager.getRepository(User));
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

export default {
    createResult,
};