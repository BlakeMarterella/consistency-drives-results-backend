export interface ResultCreateBody {
    name: string;
    description: string;
}

export interface ResultResponse {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}