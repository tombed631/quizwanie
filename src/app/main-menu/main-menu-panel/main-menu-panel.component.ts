import { AuthService } from '../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { MainMenuService } from '../main-menu.service';
import { Router } from '@angular/router';
import { User } from '../../models/user'
import { ActualGames } from '../../models/actualGames';
import { Game } from '../../models/game';
import { GameService } from '../../game/game.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-quiz-main-menu-panel',
  templateUrl: './main-menu-panel.component.html',
  styleUrls: ['./main-menu-panel.component.scss']
})
export class MainMenuPanelComponent {

  games: Observable<any>;
  gameRef: any;
  newGame: any;
  actualUser: User;
  name: string;
  actualUserIdGames: ActualGames[];
  activeUserGames: Game[] = [];
  finishedUserGames: Game[] = [];
  gamesInfo: Game[];
  constructor(
    private authService: AuthService,
    private db: AngularFireDatabase,
    private mainMenuService: MainMenuService,
    private gameService: GameService,
    private router: Router,
    private location: Location
  ) {

    if (!authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    history.pushState(null, null, 'main-menu');
    window.addEventListener('popstate', function(event) {
      history.pushState(null, null, 'main-menu');
    });
    this.authService.getCurrentLoggedUser().subscribe(
      (user) => {
        this.actualUser = user;
        this.actualUserIdGames = Object.values(this.actualUser.actualGames);
        this.getGamesFromFireBase();

      }
    );
  }

  getGamesFromFireBase() {
    this.gameService.getGamesFromFireBase().subscribe((games) => {
      this.finishedUserGames = [];
      this.activeUserGames = [];
      this.gamesInfo = games;
      (this.gamesInfo).forEach((game) => {
        for (let i = 0; i < this.actualUserIdGames.length; i++) {
          if (this.actualUserIdGames[i].gameId != '0' && this.actualUserIdGames[i].gameId != '' &&
            this.actualUserIdGames[i].gameId == game.id) {
            if (!game.isFinished) {
              (this.activeUserGames).push(game);
            }

          }
        }
        if (((game.user1.displayName == this.actualUser.displayName) || (game.user2.displayName == this.actualUser.displayName))
          && game.isFinished == true) {
          (this.finishedUserGames).push(game);
        }
      })
      console.log("Games" + this.activeUserGames);


    });



  }

  // POST - dodawanie do bazy danych


  newGameStart() {
    this.router.navigate(['/select-opponent']);
  }
  loadGame(game: Game) {
    this.gameService.setGame(game);
    this.router.navigate(['/game']);
  }

  removeFinishedGames() {
    this.gameService.removeFinishedGames(this.finishedUserGames);
    this.router.navigate(['/main-menu-panel']);
  }
}
