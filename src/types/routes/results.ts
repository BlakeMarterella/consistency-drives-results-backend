import type { Result } from 'src/entities/result';

export interface ResultsCreateRequest {
    userId: string;
    name: string;
    description?: string;
}

export interface ResultsCreateResponse {
    id: number;
}

export interface ResultsDeleteRequest {
    id: number;
}

export interface ResultsDeleteResponse {
    id: number;
    userId: string;
    name: string;
}

export interface ResultsUpdateRequest {
    name?: string;
    description?: string;
}

export type ResultsUpdateResponse = Result;