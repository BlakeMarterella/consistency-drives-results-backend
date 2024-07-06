import type { Result } from 'src/entities/result';

export interface ResultsCreateRequest {
    userId: string;
    name: string;
    description?: string;
}

export interface ResultsCreateResponse {
    id: number;
}