import type { Response } from 'express';
import createHttpError from 'http-errors';

import { AppDataSource } from '../../data-source';
import { Result } from '../../entities/result';
import type { ResultCreateBody } from '../../types/routes/result';
import { ValidateCreateBody } from './validators';
  
export const create = async (req: TypedRequestBody<ResultCreateBody>, res: Response): Promise<void> => {
    const { name, description, color } = ValidateCreateBody(req.body);  
    
    // Create a query runner to control the transactions, it allows to cancel the transaction if we need to
    const queryRunner = AppDataSource.createQueryRunner();

    // Connect the query runner to the database and start the transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const resultRepo = queryRunner.manager.getRepository(Result);
        const nameExists = await resultRepo.exists({
            where: { name }
        });
        if (nameExists) {
            throw createHttpError(409, 'Name already exists');
        }

        const newResult = resultRepo.create(req.body);
        await queryRunner.manager.save(newResult);

        // No exceptions occured, so we commit the transaction
        await queryRunner.commitTransaction();

        res.send(newResult.id);
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
    create,
};