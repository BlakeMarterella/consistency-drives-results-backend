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