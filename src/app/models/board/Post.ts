import { User } from '../myinfo/User';

export interface Post {
  uid: string;
  title: string;
  author: string;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
  user: User;
  status: string;
  startDate: Date;
  dueDate: Date;
  priority: number;
}