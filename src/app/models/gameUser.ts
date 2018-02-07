import { StateOfLastAnswers } from "./stateOfLastAnswers";

export interface GameUser {
    isFinished: boolean,
    isSurrender: boolean,
    email: string,
    displayName: string,
    myTurn: boolean,
    points: number,
    stateOfLastAnswers: StateOfLastAnswers[];
  }