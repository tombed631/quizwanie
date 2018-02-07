import { GameService } from '../game.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Game } from '../../models/game';
import { User } from '../../models/user';
import { AuthService } from '../../auth/auth.service';
import { GameUser } from '../../models/gameUser';
import { CategoryRounds } from '../../models/categoryRounds';
import { StateOfLastAnswers } from '../../models/stateOfLastAnswers';
import { CategoryService } from '../../category/category.service';
import { QuestionService } from '../../question/question.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Category } from '../../models/category';
import { Location } from '@angular/common';
import { ActualGames } from '../../models/actualGames';
import { forEach } from '@angular/router/src/utils/collection';
@Component({
  selector: 'quiz-game-panel',
  templateUrl: './game-panel.component.html',
  styleUrls: ['./game-panel.component.scss']
})
export class GamePanelComponent implements OnInit {
  actualUser: User;
  actualGameOpponent: GameUser;
  actualGameUser: GameUser;
  game: Game;
  isPlayButton: boolean = false;
  isChooseCategoryButton: boolean= false;
  showWaitText: boolean= false;
  categoryRounds: CategoryRounds[];
  actualCategory: CategoryRounds;
  gameUserLastAnswers: StateOfLastAnswers[];
  gameOpponentLastAnswers: StateOfLastAnswers[];
  roundNumber: number;
  allCategories: Category[];
  endGame: boolean = false;
  userGameString: string;
  endGameText: string ="";
  actualGames: ActualGames[];
  constructor(private gameService: GameService,
    private router: Router,private authService: AuthService,
    private categoryService: CategoryService, private questionService: QuestionService,
    private db: AngularFireDatabase,private location: Location
  ) 
  {
   


      this.game = this.gameService.actualGame;
            history.pushState(null, null, 'game');
      window.addEventListener('popstate', function(event) {
      history.pushState(null, null, 'game');
      });
    
      this.authService.getCurrentLoggedUser().subscribe(user => this.actualUser = user);
     
      // poniewaz obserwujemy obiekt tej gry i ona dynamicznie sie zmienia
      this.gameService.getGameById(this.game.id).subscribe(game =>
      {
           this.endGame=false;
           this.game = game;
  
          if(this.game.user1.email == this.actualUser.email)
          {
            this.userGameString = "user1";
            this.actualGameUser = this.game.user1;
            this.actualGameOpponent = this.game.user2;
          }
          else
          {
            this.userGameString = "user2";
            this.actualGameUser = this.game.user2;
            this.actualGameOpponent = this.game.user1;
          }
        
          localStorage.setItem('gameId', this.game.id);
          if(this.game.categoryRounds!=null && this.game.categoryRounds!=undefined)
          {
              this.categoryRounds = Object.values(this.game.categoryRounds);
              this.roundNumber =  this.categoryRounds.length;
          }
           
          console.log("wzmianaaA");
          //this.actualCategory = this.categoryRounds[this.categoryRounds.length -1];
          this.gameUserLastAnswers = this.actualGameUser.stateOfLastAnswers;
          this.gameOpponentLastAnswers = this.actualGameOpponent.stateOfLastAnswers;

          if(!this.game.isFinished)
          {
            
            if(!this.game.user1.isSurrender && !this.game.user2.isSurrender 
            && this.actualGameOpponent.myTurn==false && this.actualGameUser.myTurn==false)
               this.isEndGame();
          }
          else  
            this.endGame=true;
          this.showButtons();
      }


      )

    

  }

  surrender()
  {
    this.actualGameUser.isSurrender=true;
    this.game.isFinished=true;
    this.game.whoWinGame = this.actualGameOpponent.displayName;
    this.db.database.ref('/games/' + this.game.id +'/' ).update(this.game);
    this.db.database.ref('/games/' + this.game.id +'/'  + this.userGameString+'/').update(this.actualGameUser);
  this.removeActualGames();
   
  }
  removeActualGames()
  {
     this.gameService.getActualGames().subscribe(actualGames=> 
    {
      console.log(Object.values(actualGames));
      console.log(actualGames);
      Object.values(actualGames).forEach(actualGame => 
      {
         if(this.game.id == actualGame.gameId)
            this.db.database.ref('/users/' + this.actualUser.id +'/actualGames/' + actualGame.$key).remove();
      });
    
    })
  }
  isEndGame()
  {

    if(this.actualGameUser.isSurrender || this.actualGameOpponent.isSurrender)
        this.endGame=true;
   this.questionService.getCategories().subscribe
   ( categories =>
     {
       this.allCategories = categories
       if (this.allCategories.length==this.roundNumber)
       {
          this.endGame=true;
          return;
       }
     });

     if(this.roundNumber >= 1)
        this.endGame = true;
    
    if(this.endGame)
    {
      if(this.actualGameUser.points>this.actualGameOpponent.points)
          this.game.whoWinGame=this.actualGameUser.displayName;
      else if(this.actualGameUser.points<this.actualGameOpponent.points)
          this.game.whoWinGame=this.actualGameOpponent.displayName;
      else
          this.game.whoWinGame="draw";
      this.game.isFinished=true;
      this.db.database.ref('/games/' + this.game.id +'/' ).update(this.game);
      this.removeActualGames();

    }
     
  }
  showButtons()
  {
    this.showWaitText = false;
    this.isChooseCategoryButton = false;
    this.isPlayButton = false;
    //wybor katerogii na poczatku
    if(!this.game.isFinished && !this.endGame)
    {
        if(this.game.actualCategoryName == null || this.game.actualCategoryName=="")
            {
              //wybiera kategorie ten ktory utworzyl gre
              if(this.game.whoChoosedCategoryLast == this.actualGameUser.email) 
              {
                this.isChooseCategoryButton = true;
              }
              else
              {
                this.showWaitText = true;
              }
            }
            else
            {

                if (this.actualGameUser.myTurn)
                {
                    this.isPlayButton = true;
                }

                if(!this.actualGameUser.myTurn && !this.actualGameOpponent.myTurn)
                {
                    if(this.game.whoChoosedCategoryLast == this.actualGameUser.email)
                    {
                        this.showWaitText = true;
                    }
                    else if(this.game.whoChoosedCategoryLast == this.actualGameOpponent.email)
                    {
                      this.isChooseCategoryButton = true;
                    }
                }
            }
    }
    else
    {
        this.removeActualGames();
        if(this.actualGameUser.isSurrender)
            this.endGameText = "Przegrałeś przez poddanie!";
          else if(this.actualGameOpponent.isSurrender)
              this.endGameText = "Wygrałeś! Twój przeciwnik się poddał!";
          else
          {
            if(this.actualGameUser.points>this.actualGameOpponent.points)
               this.endGameText = "Wygrałeś!";
            else if(this.actualGameUser.points<this.actualGameOpponent.points)
               this.endGameText = "Przegrałeś!";
            else
              this.endGameText = "Remis!";
          }

    }
    




  }

  updateLastChoosedCategory()
  {
    this.game.whoChoosedCategoryLast = this.actualGameUser.email;
    this.db.database.ref('/games/' + this.game.id +'/' ).update(this.game);
  }
  chooseCategory()
  {
      localStorage.setItem('gameId', this.game.id);
      this.router.navigate(['/category']);
  }

  ngOnInit() {
  }
  play()
  {
    this.questionService.gameId = this.game.id;
    this.questionService.actualGameOpponent = this.actualGameOpponent;
    this.questionService.actualGameUser = this.actualGameUser;
    this.router.navigate(['/questions']);
  }
  back()
  {
    this.router.navigate(['/main-menu']);

  }

}