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
        const user = await createTestUser();
        const result = {
            description: 'Hello World!',
            userId: user.id,
        };

        const res = await request(server).post('/results').send(result);

        expect(res.status).toEqual(400);
        expect(res.body.error).toEqual('Missing name');
    });

    test('Create result fails if name is too long', async () => {
        const user = await createTestUser();
        const result = {
            name: 'a'.repeat(256),
            description: 'Hello World!',
            userId: user.id,
        };

        const res = await request(server).post('/results').send(result);

        expect(res.status).toEqual(400);
        expect(res.body.error).toEqual('Name is too long');
    });

    test('Create result fails if missing user id', async () => {
        const result = {
            name: 'Test result',
            description: 'Hello World!',
        };

        const res = await request(server).post('/results').send(result);

        expect(res.status).toEqual(400);
        expect(res.body.error).toEqual('Missing user id');
    });

    test('Create result fails if user id does not exist', async () => {
        const result = {
            name: 'Test result',
            description: 'Hello World!',
            userId: 'fakeUserId',
        };

        const res = await request(server).post('/results').send(result);

        expect(res.status).toEqual(400);
        expect(res.body.error).toEqual('User not found');
    });
});

describe('Delete a result', () => {
    afterEach(async () => {
        await clearDatabase();
    });
    
    test('Delete a result', async () => {
        const user = await createTestUser();
        const result = new Result();
        result.name = 'Test result';
        result.description = 'Hello World!';
        result.user = user;
        await AppDataSource.getRepository(Result).save(result);

        const res = await request(server).delete(`/results/${result.id}`);

        const resultRepo = AppDataSource.getRepository(Result);
        const deletedResult = await resultRepo.findOneBy({ id: result.id });

        expect(res.status).toEqual(200);
        expect(deletedResult).toBeNull();
    });

    test('Delete a result fails if result does not exist', async () => {
        const res = await request(server).delete('/results/1');

        expect(res.status).toEqual(400);
        expect(res.body.error).toEqual('Result not found');
    });
});

describe('Update a result', () => {
    afterEach(async () => {
        await clearDatabase();
    });
    
    test('Update a result', async () => {
        const user = await createTestUser();
        const result = new Result();
        result.name = 'Test result';
        result.description = 'Hello World!';
        result.user = user;
        await AppDataSource.getRepository(Result).save(result);

        const newName = 'New name';
        const newDescription = 'New description';
        const res = await request(server).put(`/results/${result.id}`).send({ name: newName, description: newDescription });

        const resultRepo = AppDataSource.getRepository(Result);
        const updatedResult = await resultRepo.findOneBy({ id: result.id });

        expect(res.status).toEqual(200);
        expect(updatedResult).not.toBeNull();
        if (updatedResult) {
            expect(updatedResult.name).toEqual(newName);
            expect(updatedResult.description).toEqual(newDescription);
        }
    });    

    test('Update a result fails if result does not exist', async () => {
        const res = await request(server).put('/results/1').send({ name: 'New name' });

        expect(res.status).toEqual(400);
        expect(res.body.error).toEqual('Result not found');
    });

    test('Update a result fails if name is too long', async () => {
        const user = await createTestUser();
        const result = new Result();
        result.name = 'Test result';
        result.description = 'Hello World!';
        result.user = user;
        await AppDataSource.getRepository(Result).save(result);

        const res = await request(server).put(`/results/${result.id}`).send({ name: 'a'.repeat(256) });

        expect(res.status).toEqual(400);
        expect(res.body.error).toEqual('Name is too long');
    });
});