import { CategoryRounds } from './categoryRounds';
import { GameUser } from './gameUser';

export interface Game {
  categoryRounds: CategoryRounds[],
  actualCategoryName: string;
  id: string,
  user1:GameUser,
  user2:GameUser,
  whoChoosedCategoryLast: string;
  whoWinGame: string;
  isFinished: boolean
}