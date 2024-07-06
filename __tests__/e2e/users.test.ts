import type { Server } from 'http';
import request from 'supertest';

import { AppDataSource } from '../../src/data-source';
import { User } from '../../src/entities/user';
import { clearDatabase, closeDatabase, createTestServer } from '../utils/testsHelpers';
import { createTestUser } from '../utils/userHelpers';
import e from 'express';
import ErrorMessages from 'src/controllers/common/errorMessages';

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
        expect(res.body.message).toEqual('Id is not a valid UUID');
    });
});

describe('List users', () => {
    afterEach(async() => {
        await clearDatabase();
    });

    test('List all users', async () => {
        const user1 = await createTestUser({ email: 'email1@gmail.com', username: 'username1' });
        const user2 = await createTestUser({ email: 'email2@gmail.com', username: 'username2' });
        const user3 = await createTestUser({ email: 'email3@gmail.com', username: 'username3' });
        const expectedUsers = [user1, user2, user3];

        const res = await request(server).get('/api/users');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(expectedUsers);
    });
});

describe('Update user', () => {
    afterEach(async () => {
        await clearDatabase();
    });

    test("Update a user's email", async () => {
        const user = await createTestUser();
        const newEmail = 'updatedEmail@gmail.com';

        const res = await request(server).put(`/api/users/${user.id}`).send({ email: newEmail });
        const newUser = user;
        newUser.email = newEmail;
        newUser.updatedAt = res.body.updatedAt;

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(newUser);
    });

    test("Update a user's first name", async () => {
        const user = await createTestUser();
        const newFirstName = 'UpdatedName';

        const res = await request(server).put(`/api/users/${user.id}`).send({ firstName: newFirstName });
        const newUser = user;
        newUser.firstName = newFirstName;
        newUser.updatedAt = res.body.updatedAt;

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(newUser);
    });

    test("Update a user's last name", async () => {
        const user = await createTestUser();
        const newLastName = 'UpdatedLastName';

        const res = await request(server).put(`/api/users/${user.id}`).send({ lastName: newLastName });
        const newUser = user;
        newUser.lastName = newLastName;
        newUser.updatedAt = res.body.updatedAt;

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(newUser);
    });

    test('Update user fails if user does not exist', async () => {
        const res = await request(server).put('/api/users/d0bb847f-d901-4abe-be9e-c6ddac9d29e1').send({ firstName: 'UpdatedName' });

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('User not found');
    });

    test("Update user fails if id is malformed", async () => {
        const res = await request(server).put('/api/users/1234').send({ firstName: 'UpdatedName' });

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Id is not a valid UUID');
    });

    test("Update user's email fails if email is already taken", async () => {
        const user1 = await createTestUser({ email: 'blake@gmail.com', username: 'blake' });
        const user2 = await createTestUser({ email: 'rahul@gmail.com', username: 'rahul' });

        const res = await request(server).put(`/api/users/${user1.id}`).send({ email: user2.email });

        expect(res.statusCode).toEqual(409);
        expect(res.body.message).toEqual('Email already exists');
    });

    test("Update user's email fails if email is malformed", async () => {
        const user = await createTestUser();

        const res = await request(server).put(`/api/users/${user.id}`).send({ email: 'invalidEmail' });

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Email is invalid');
    });

    test("Update all user's information", async () => {
        const user = await createTestUser();
        const newEmail = 'hi@gmail.com';
        const newFirstName = 'newFirstName';
        const newLastName = 'newLastName';

        const res = await request(server).put(`/api/users/${user.id}`).send({ email: newEmail, firstName: newFirstName, lastName: newLastName });
        const newUser = user;
        newUser.email = newEmail;
        newUser.firstName = newFirstName;
        newUser.lastName = newLastName;
        newUser.updatedAt = res.body.updatedAt;

        expect(res.statusCode).toEqual(200);
    });
});

describe('Get User', () => {
    afterEach(async () => {
        await clearDatabase();
    });

    test('Get a user', async () => {
        const user = await createTestUser();
        const res = await request(server).get(`/api/users/${user.id}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(user);
    });

    test('Get user fails if user does not exist', async () => {
        const res = await request(server).get('/api/users/d0bb847f-d901-4abe-be9e-c6ddac9d29e1');

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('User not found');
    });

    test('Get user fails if id is malformed', async () => {
        const res = await request(server).get('/api/users/1234');

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Id is not a valid UUID');
    });
});