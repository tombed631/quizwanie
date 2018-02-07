import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Game } from '../models/game';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { CategoryRounds } from '../models/categoryRounds';
import { GameUser } from '../models/gameUser';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { ActualGames } from '../models/actualGames';

@Injectable()
export class GameService {
  private objCategory: any;
  actualGame: Game;
  categoryRounds: CategoryRounds;
  loginUser: User;
  actualGameUser: GameUser;
  actualGameOpponent: GameUser;
  opponent: User;
  allOpponents: User[];
  user1: GameUser;
  user2: GameUser;
  constructor(private http: Http, private db: AngularFireDatabase, private authService: AuthService,
    private router: Router) {
    this.authService.getCurrentLoggedUser().subscribe(user => this.loginUser = user);
  }

  getGameById(id: string): FirebaseObjectObservable<Game> {
    return this.db.object('/games/' + id);
  }

  setGame(game: Game) {
    this.actualGame = game;
    localStorage.removeItem('opponent');
    localStorage.setItem('actualGameOpponent', JSON.stringify(this.actualGameOpponent));
    if (game.user1.email == this.loginUser.email) {
      this.actualGameUser = game.user1;
      this.actualGameOpponent = game.user2;
    }
    else {
      this.actualGameUser = game.user2;
      this.actualGameOpponent = game.user1;
    }
  }
  newGame(opponent: User) {
    this.opponent = opponent;

    this.categoryRounds = {
      categoryName: "",
      choosenQuestionId: [{ questionId: 0 }]
    }
    this.actualGameUser =
      {
        isFinished: false,
        isSurrender: false,
        email: this.loginUser.email,
        displayName: this.loginUser.displayName,
        myTurn: true,
        points: 0,
        stateOfLastAnswers: [{ state: 0 }, { state: 0 }, { state: 0 }]
      }
    this.actualGameOpponent =
      { 
        isFinished: false,
        isSurrender: false,
        email: this.opponent.email,
        myTurn: true,
        displayName: this.opponent.displayName,
        points: 0,
        stateOfLastAnswers: [{ state: 0 }, { state: 0 }, { state: 0 }]
      }

    this.actualGame =
      {
        categoryRounds: null,
        actualCategoryName: "",
        id: "",
        isFinished: false,
        user1: this.actualGameUser,
        user2: this.actualGameOpponent,
        whoChoosedCategoryLast: this.actualGameUser.email,
        whoWinGame: "none"
      }

    var key = this.db.database.ref('/games').push(this.actualGame).key;
    this.actualGame.id = key;
    this.db.database.ref('/games/' + key + '/').update(this.actualGame);
    console.log("PUSHUJE ACTUAL GAMES: " + this.loginUser.id)
    this.db.database.ref('/users/' + this.loginUser.id + '/actualGames').push({
      gameId: key
    })
    console.log("Opponent ID : " + opponent.id);
    this.db.database.ref('/users/' + this.opponent.id + '/actualGames').push({
      gameId: key
    })
    localStorage.removeItem('actualGameOpponent');
    localStorage.setItem('actualGameOpponent', JSON.stringify(this.actualGameOpponent));
  }

  getOpponent(): User {
    return this.opponent;
  }
  getGamesFromFireBase(): FirebaseListObservable<Game[]> {
    return this.db.list('/games');
  }

  getActualGames(): FirebaseListObservable<any[]> {
    return this.db.list('/users/' + this.loginUser.id + '/actualGames/');
  }

  removeFinishedGames(games: Game[]) {
    console.log("Hello")
    for (var i = 0; i < games.length; i++) {
      this.db.database.ref('/games/' + games[i].id + '/').remove();
    }
  }
}
