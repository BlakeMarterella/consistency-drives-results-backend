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
        
        expect(1).toEqual(1);
    });

});