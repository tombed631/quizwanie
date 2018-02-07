import { Answer } from './answer';

export interface Question {
  answers: Answer[];
  text: string;
  id: number;
}
