import { AppDataSource } from '../../src/data-source';
import { User } from '../../src/entities/user';

export interface TestUserProps {
    username?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}


/**
 * Create a user in database.
 * @param testUser - User informations. Optional.
 * @returns The created user as an object
 */
export const createTestUser = async (testUser?: TestUserProps) => {
    const userRepo = AppDataSource.getRepository(User);

    let user = new User();
    user.username = testUser?.username || 'testUser';
    user.firstName = testUser?.firstName || 'First';
    user.lastName = testUser?.lastName || 'Last';
    user.email = testUser?.email || 'testUser@gmail.com';
    user.setPassword(testUser?.password || 'password');

    user = await userRepo.save(user);
    return {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        deletedAt: user.deletedAt ? user.deletedAt.toISOString() : null
    };
};