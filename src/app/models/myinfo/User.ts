export interface Role {
    role: string;
};

export interface User {
    uid: string;
    name: string;
    imageUrl: string;
    createdAt: Date;
    modifiedAt: Date;
    role?: Role;
};

export interface Member{
    uid: number;
    board: string;
    user: string;
    name?: string;
    role?: Role;
}