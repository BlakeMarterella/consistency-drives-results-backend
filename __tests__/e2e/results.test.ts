import type { Server } from 'http';
import request from 'supertest';

import { AppDataSource } from '../../src/data-source';

import { Result } from '../../src/entities/result';
import { clearDatabase, closeDatabase, createTestServer } from '../utils/testsHelpers';

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
        const testName = 'fakeResult';
        const testDescription = 'fakeResultDescription';

        const res = await request(server).post('/api/results').send({ name: testName, description: testDescription });

        const resultRepo = AppDataSource.getRepository(Result);
        const result = await resultRepo.findOneByOrFail({ name: testName });

        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual(result.id);
    });

    test('Create result fails if query body is invalid', async () => {
        const testDescription = 'fakeResultDescription';
        
        // Missing Name
        const res1 = await request(server).post('/api/results').send({ description: testDescription });
        expect(res1.statusCode).toEqual(400);
        expect(res1.body.message).toEqual('Name required');
    });

    test('Fetch all results', async () => {

    });

});