import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Router} from '@angular/router';

import { AuthService } from '../../auth/auth.service';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { AngularFireList } from 'angularfire2/database';
import { Game } from '../../models/game';
import { CategoryRounds } from '../../models/categoryRounds';
import { User } from '../../models/user';
import { ActualGames } from '../../models/actualGames';


@Component({
  selector: 'quiz-select-opponent',
  templateUrl: './select-opponent.component.html',
  styleUrls: ['./select-opponent.component.scss']
})
export class SelectOpponentComponent implements OnInit {

actualUser: User;
  constructor(private gameService: GameService,private authService:AuthService,
     private router: Router,private db: AngularFireDatabase) 
     {
         if(!authService.isLoggedIn())
         {
              console.log("wylogowanie select opp")
              this.router.navigate(['/']);
            }
          this.authService.getCurrentLoggedUser().subscribe(user => this.actualUser = user);
          this.getAllOpponnents();
          console.log("Constructor select-opponent");
    }

  private allOpponents : User[]=[];
  ngOnInit() {
    console.log("0n init");

  }

 getAllOpponnents()
  {
     this.authService.getUsersFromFireBase().subscribe((users)=>
     {
        this.allOpponents=[];
        users.forEach(opponent => {
            if(opponent.email!=this.actualUser.email)
            {
              let canBeAdded = true;
              if(opponent.actualGames != undefined && this.actualUser.actualGames != undefined ){
                let arrUserGames = Object.values(this.actualUser.actualGames);
                let arrOppGames =  Object.values(opponent.actualGames);
                //Uzywam zwyklego fora, zamiast foreach, bo tak jest wydajniej tutaj (uzycie break)
                for(let oppGame of arrOppGames){
                    for(let userGame of arrUserGames){
                      if(userGame.gameId != "0" && oppGame.gameId == userGame.gameId){
                        canBeAdded = false;
                        break;
                      }
                    }
                    if(!canBeAdded) break;
                }
              }
              if(canBeAdded){
                this.allOpponents.push(opponent);
              }
            }
          })
        })                                     
        
  };
     
 

 chooseOpponent(opponent:User)  {
    this.allOpponents.splice(this.allOpponents.indexOf(opponent), 1);
    this.gameService.newGame(opponent);
    this.router.navigate(['/game']);
   }

 
}
