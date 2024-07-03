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