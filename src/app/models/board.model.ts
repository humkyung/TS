import { Column } from './column.model';
import { User } from './myinfo/User';

export interface Project {
    uid?: string;
    title?: string;
    description?: string;
    picture?: any;
    createdAt?: Date;
    progress?: number;
    user?: User;
    boards?: Board[];
}

export class Board {
    constructor(public name: string, public columns: Column[]) {}
}