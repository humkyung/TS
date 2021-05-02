import { Post } from '../models/board/Post';

export class Column {
    constructor(public name: string, public tasks: Post[]) {}
}