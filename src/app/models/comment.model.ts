import { User } from './myinfo/User';

export interface Comment {
    uid?: number;
    content?: string;
    createdAt: Date;
    user?: User;
}