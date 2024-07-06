import type { User } from 'src/entities/user';

export interface UsersCreateRequest {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface UsersCreateResponse {
    id: string;
}

export interface UsersDeleteRequest {
    id: string;
}

export interface UsersDeleteResponse {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface UsersUpdateRequest {
    email?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
}

export type UsersUpdateResponse = User;

export type UsersListResponse = User[];