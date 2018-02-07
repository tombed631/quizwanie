import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Category } from '../models/category';
import { CategoryRounds } from '../models/categoryRounds';
import { Question } from '../models/question';
import { last } from '@angular/router/src/utils/collection';
import { Router} from '@angular/router';
import { ChoosenQuestionsId } from '../models/choosenQusetionId';
import { Game } from '../models/game';
import { GameUser } from '../models/gameUser';

@Injectable()
export class QuestionService {
  gameId: string;
  actualGameOpponent: GameUser;
  actualGameUser: GameUser;
  constructor(private db: AngularFireDatabase, private router: Router) 
  {
  

   }
  choosenQuestionsid: ChoosenQuestionsId[] =[];
  category: Category;
  questions: Question[];
  setCategory(category: Category)
  {
    this.category = category;
  }

  getCategory()
  {
    return this.category;
  }

  chooseRandomQuestions(category: Category,categoryRound: CategoryRounds,key: any)
  {
      this.questions = this.shuffle(category.questions).slice(0,3);
      console.log("choosedQuestions:");
      console.log(this.questions);

      this.questions.forEach(question => {
          this.choosenQuestionsid.push({
            questionId: question.id
            });

      })

      categoryRound.choosenQuestionId =  this.choosenQuestionsid;
      this.db.database.ref('/games/' + this.gameId +'/categoryRounds/'+key+'/').update(categoryRound);

  }


   shuffle(input: any[]):any[] {
    
    
    for (var i = input.length-1; i >=0; i--) {
    
        var randomIndex = Math.floor(Math.random()*(i+1)); 
        var itemAtIndex = input[randomIndex]; 
        
        input[randomIndex] = input[i]; 
        input[i] = itemAtIndex;
    }
    return input;
}


  getGameById(id: string): Observable<Game>{
    return this.db.object('/games/' + id);
  }

  getCategories(): Observable<Category[]> {
    return this.db.list('/categories');
  }

  
}
