import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';
import { Category } from '../../models/category';
import { User } from '../../models/user';
import { Observable } from 'rxjs/Observable';
import { Router} from '@angular/router';
import { QuestionService } from '../../question/question.service';
import { AuthService } from '../../auth/auth.service';
import { Game } from '../../models/game';
import { CategoryRounds } from '../../models/categoryRounds';
import { forEach } from '@angular/router/src/utils/collection';
import { ChoosenQuestionsId } from '../../models/choosenQusetionId';
import { AngularFireDatabase } from 'angularfire2/database';
import { GameUser } from '../../models/gameUser';
@Component({
  selector: 'quiz-select-category',
  templateUrl: './select-category.component.html',
  styleUrls: ['./select-category.component.scss']
})

export class SelectCategoryComponent implements OnInit {
  readonly categoriesCount: number = 3;
  allCategories: Category[];
  filterCategories: Category[] =[]; 
  categoryError: boolean = false;
  category: Category;
  gameId: string;
  game: Game;
  categoryRounds: CategoryRounds[];
  newCategoryRound: CategoryRounds;
  choosenCategoriesNames: string[]= [];
  actualUser: User;
  user1: GameUser;
  user2: GameUser;
  constructor(private categoryService: CategoryService,private authService: AuthService,
  private questionService: QuestionService, private db: AngularFireDatabase, private router: Router) {
    
       
      this.authService.getCurrentLoggedUser().subscribe(user => this.actualUser = user);
    if(!authService.isLoggedIn())
    {
      console.log("wylogowanie select category 1")
      this.router.navigate(['/']);
    }
    this.gameId = localStorage.getItem('gameId');
    if(this.gameId == null || this.gameId == undefined || this.gameId == "")
    {
      console.log("wylogowanie select category")
      this.router.navigate(['/']);
    }
       


    this.categoryService.getGameById(this.gameId).subscribe((game) =>
      {
        this.game = game;
        if(this.game.categoryRounds!=null && this.game.categoryRounds!=undefined)
           this.categoryRounds = Object.values(this.game.categoryRounds);
      })
      this.loadCategories();



  }

  ngOnInit() {
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((categories) => {
    this.allCategories = categories;
    this.filterCategories=[];
    this.choosenCategoriesNames = [];
    if(this.categoryRounds!=null && this.categoryRounds!=undefined)
    {
        this.categoryRounds.forEach(category =>{
          this.choosenCategoriesNames.push(category.categoryName);

        })
        let canBeAdd = true;
          for(let nameFromAllCategories of this.allCategories)
          {
            for(let name of this.choosenCategoriesNames)
            {
              if(nameFromAllCategories.name == name)
              {
                canBeAdd = false;
                break;
              }
            }
            if(canBeAdd)
              this.filterCategories.push(nameFromAllCategories)
            else
              canBeAdd = true;
        }
      }
      else
        this.filterCategories = this.allCategories;
      this.filterCategories=this.questionService.shuffle(this.filterCategories).slice(0,3); 
      }

     
    )

    
  };
   
  
  chooseCategory(category: Category)  {
    this.category = category;
    this.db.database.ref('/games/' + this.gameId +'/').update({
            actualCategoryName: category.name
    })
    this.db.database.ref('/games/' + this.gameId +'/').update({
            whoChoosedCategoryLast: this.actualUser.email
    })
    this.createRound();
    this.updateStatesForUsers();

    this.router.navigate(['/game']);
   } 

   updateStatesForUsers()
   {
     this.user1 = this.game.user1;
     this.user2 = this.game.user2;
    console.log("updatestates");
    console.log(this.game)
    console.log(this.game.categoryRounds)
    console.log(this.categoryRounds)
        console.log(this.gameId)

    if(this.categoryRounds.length>1)
    { 
        for(let i=0;i<3;i++)
        {
          this.user1.stateOfLastAnswers.push({
                state: 0
          });
          this.user2.stateOfLastAnswers.push({
                state: 0
          })
        }
        this.user1.myTurn = true;
        this.user2.myTurn = true;
         this.db.database.ref('/games/' + this.gameId +'/user1/').update(this.user1);
         this.db.database.ref('/games/' + this.gameId +'/user2/').update(this.user2);

      
    }




   }



   createRound()
   {
      this.newCategoryRound = {
        categoryName : this.category.name,
        choosenQuestionId: null
       }
      this.categoryRounds = [];
      this.categoryRounds.push(this.newCategoryRound);
      let categoryRoundKey = 
      this.db.database.ref('/games/' + this.gameId +'/categoryRounds/').
      push(this.newCategoryRound).key;
      this.questionService.gameId=this.gameId;

      this.questionService.chooseRandomQuestions(this.category,this.newCategoryRound,categoryRoundKey);



   }

 
} 