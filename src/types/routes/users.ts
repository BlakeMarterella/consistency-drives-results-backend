export interface UsersCreateBody {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface UsersUpdateRequest {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
}

export interface UsersUpdateResponse {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}