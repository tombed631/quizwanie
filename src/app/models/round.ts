import { Category } from './category';
import { Question } from './question';
import { User } from './user';

export interface Round {
  category: Category;
  questions: Question[];
  user1: User;
  user2: User;
}
