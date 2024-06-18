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
        const name = 'fakeResult';
        const description = 'fakeResultDescription';
        const color = '#FFFFFF';

        const res = await request(server).post('/api/results').send({ name, description, color });

        const resultRepo = AppDataSource.getRepository(Result);
        const result = await resultRepo.findOneByOrFail({ name });

        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual(result.id);
    });

    test('Create result fails if query body is invalid', async () => {
        const name = 'fakeResult';
        const description = 'fakeResultDescription';
        const color = '#FFFFFF';
        
        // Missing Name
        const res1 = await request(server).post('/api/results').send({ description, color });
        expect(res1.statusCode).toEqual(400);
        expect(res1.body.message).toEqual('Name required');

        // Name is 0 character long
        const res2 = await request(server).post('/api/results').send({ name: 'a', description, color });
        expect(res2.statusCode).toEqual(400);
        expect(res2.body.message).toEqual('Name must be at least 2 characters long');

        // Missing Color
        const res3 = await request(server).post('/api/results').send({ name, description });
        expect(res3.statusCode).toEqual(400);
        expect(res3.body.message).toEqual('Color required');

        // Color is not a valid hex color
        const res4 = await request(server).post('/api/results').send({ name, description, color: 'FFFFFF' });
        expect(res4.statusCode).toEqual(400);
        expect(res4.body.message).toEqual('Color must be a valid hex color');
        
        const res5 = await request(server).post('/api/results').send({ name, description, color: '#FFFFF' });
        expect(res5.statusCode).toEqual(400);
        expect(res5.body.message).toEqual('Color must be a valid hex color');
        
        const res6 = await request(server).post('/api/results').send({ name, description, color: '#FFFFFFFF' });
        expect(res6.statusCode).toEqual(400);
        expect(res6.body.message).toEqual('Color must be a valid hex color');
    });

    test('Fetch all results', async () => {

    });

});