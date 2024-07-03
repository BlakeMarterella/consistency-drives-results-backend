import type { Server } from 'http';
import request from 'supertest';

import { AppDataSource } from '../../src/data-source';
import { User } from '../../src/entities/user';
import { clearDatabase, closeDatabase, createTestServer } from '../utils/testsHelpers';
import { createTestUser } from '../utils/userHelpers';
import e from 'express';

let server: Server;

beforeAll(async() => {
    server = await createTestServer();
});

afterAll(async () => {
    await closeDatabase();
    server.close();
});

describe('Create user', () => {
    afterEach(async () => {
        await clearDatabase();
    });

    test('Create a user', async () => {
        const username = 'fakeUser';
        const email = 'fakeUser@gmail.com';
        const firstName = 'Fake';
        const lastName = 'User';
        const password = 'fakeUserPwd';

        const res = await request(server).post('/api/users').send({ username, email, password, firstName, lastName});

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOneByOrFail({ username });

        expect(res.statusCode).toEqual(200);
        expect(JSON.parse(res.text)).toEqual({ id: user.id });
    });

    test('User creation fails if query body is invalid', async () => {
        const username = 'fakeUser';
        const firstName = 'Fake';
        const lastName = 'User';
        const email = 'fakeUser@gmail.com';
        const password = 'fakeUserPwd';

        // Missing username
        const res1 = await request(server).post('/api/users').send({ email, firstName, lastName, password });

        expect(res1.statusCode).toEqual(400);
        expect(res1.body.message).toEqual('Username required');

        // Missing email
        const res2 = await request(server).post('/api/users').send({ username, firstName, lastName, password });

        expect(res2.statusCode).toEqual(400);
        expect(res2.body.message).toEqual('Email required');
        
        // Missing password
        const res3 = await request(server).post('/api/users').send({ username, email, firstName, lastName });
        
        expect(res3.statusCode).toEqual(400);
        expect(res3.body.message).toEqual('Password required');
        
        // Missing First Name
        const res4 = await request(server).post('/api/users').send({ username, email, lastName, password });
        
        expect(res4.statusCode).toEqual(400);
        expect(res4.body.message).toEqual('First name required');

        // Missing Last Name
        const res5 = await request(server).post('/api/users').send({ username, email, firstName, password });
        
        expect(res5.statusCode).toEqual(400);
        expect(res5.body.message).toEqual('Last name required');

        // Username have less that 5 characters
        const res6 = await request(server).post('/api/users').send({ username: 'fake', email, password, firstName, lastName });

        expect(res6.statusCode).toEqual(400);
        expect(res6.body.message).toEqual('Username must contain at least 5 characters');

        // Password have less that 8 characters
        const res8 = await request(server).post('/api/users').send({ username, email, password: 'fake', firstName, lastName });

        expect(res8.statusCode).toEqual(400);
        expect(res8.body.message).toEqual('Password must contain at least 8 characters');
    });

    test('User creation fails if username or email already exists', async () => {
        const { username, firstName, lastName, email } = await createTestUser();

        // Username already existing
        const res1 = await request(server).post('/api/users').send({ username, email: 'otherEmail@gmail.com', password: 'password', firstName: firstName, lastName: lastName });
        expect(res1.statusCode).toEqual(409);
        expect(res1.body.message).toEqual('Username already exists');

        // Email already existing
        const res2 = await request(server).post('/api/users').send({ username: 'otherUsername', email, password: 'password', firstName: firstName, lastName: lastName });
        expect(res2.statusCode).toEqual(409);
        expect(res2.body.message).toEqual('Email already exists');
    });
});

describe('Delete user', () => {
    afterEach(async () => {
        await clearDatabase();
    });

    test('Delete a user', async () => {
        const { username, email, firstName, lastName } = await createTestUser();

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOneByOrFail({ username });

        const res = await request(server).delete(`/api/users/${user.id}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ username, email, firstName, lastName });
    });

    test('Delete user fails if user does not exist', async () => {
        const res = await request(server).delete('/api/users/d0bb847f-d901-4abe-be9e-c6ddac9d29e1');

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('User not found');
    });

    test('Delete user fails if query body is malformed id', async () => {
        const res = await request(server).delete('/api/users/1234');

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('ID is invalid');
    });
});

describe('List users', () => {
    afterEach(async() => {
        await clearDatabase();
    });

    test('List all users', async () => {
        const user1: User = await createTestUser({ email: 'email1@gmail.com' });
        const user2: User = await createTestUser({ email: 'email2@gmail.com' });
        const user3: User = await createTestUser({ email: 'email3@gmail.com' });
        
        const res = await request(server).get
    });
});