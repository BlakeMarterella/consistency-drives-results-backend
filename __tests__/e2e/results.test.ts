import type { Server } from 'http';
import request from 'supertest';

import { AppDataSource } from '../../src/data-source';
import { createTestUser } from '../utils/userHelpers';
import { Result } from '../../src/entities/result';
import { clearDatabase, closeDatabase, createTestServer } from '../utils/testsHelpers';
import e from 'express';

let server: Server;

beforeAll(async() => {
    server = await createTestServer();
});

afterAll(async () => {
    await closeDatabase();
    server.close();
});

describe('Results routes', () => {
    afterEach(async () => {
        await clearDatabase();
    });

    test('Create a result', async () => {
        const user = await createTestUser();
        const resultName = 'Test result';
        const result = {
            name: resultName,
            description: 'Hello World!',
            userId: user.id,
        };

        const res = await request(server).post('/results').send(result);

        const resultRepo = AppDataSource.getRepository(Result);
        const expectedResult = await resultRepo.findOneBy({ id: res.body.id });

        expect(expectedResult).not.toBeNull();
        expect(res.status).toEqual(200);
        if (expectedResult) {
            expect(res.body.id).toEqual(expectedResult.id);
        }
    });

    test('Create result fails if missing name', async () => {

    });

    test('Create result fails if name is too long', async () => {

    });

    test('Create result fails if missing user id', async () => {

    });

    test('Create result fails if user id does not exist', async () => {

    });
});