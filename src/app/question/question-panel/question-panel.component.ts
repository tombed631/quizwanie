import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category';
import { User } from '../../models/user';
import { Question } from '../../models/question';
import { QuestionService } from '../question.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/timer";
import "rxjs/add/operator/finally";
import "rxjs/add/operator/takeUntil";
import "rxjs/add/operator/map";
import { QuestionModule } from '../question.module';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router/';
import { CategoryRounds } from '../../models/categoryRounds';
import { Game } from '../../models/game';
import { ChoosenQuestionsId } from '../../models/choosenQusetionId';
import { Answer } from '../../models/answer';
import { timer } from 'rxjs/observable/timer';
import { take, map } from 'rxjs/operators';
  import {ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { GameUser } from '../../models/gameUser';
import { StateOfLastAnswers } from '../../models/stateOfLastAnswers';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
//import { HostListener } from '@angular/core/src/metadata/directives';
import { HostListener } from '@angular/core';

@Component({
  selector: 'quiz-question-panel',
  templateUrl: './question-panel.component.html',
  styleUrls: ['./question-panel.component.scss']
})
export class QuestionPanelComponent implements OnInit, OnDestroy {
  isStart: boolean;
  isEnd: boolean = true;
  category: Category;
  actualGameOpponent: GameUser;
  actualGameUser: GameUser;
  question: Question;  
  answers: Answer[];
  categoryName: string = "";
  categoryRound: CategoryRounds;
  questions: Question[]=[];
  choosenQuestionsId: ChoosenQuestionsId[]=[];
  questionNumber: number;
  game: Game;
  gameId: string;
  progressBar: any;
  gameUserLastAnswers: StateOfLastAnswers[] = [];
  roundNumber: number = 0;
  timer: any;
  endedAnswer: boolean = false;
  actualUser: User;
  userGameString: string;
  subscription: any;
  goodOrBadAnswerText: string= ""

  ngOnDestroy(){
    if(this.gameUserLastAnswers[2].state == 0){
      console.log("Wychodzi z gry");
      this.forceLooseGame();
    }
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    if(this.gameUserLastAnswers[2].state == 0){
      console.log("Wychodzi z gry");
      this.forceLooseGame();
    }
  }

  /*@HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
      console.log("Wychodzi z gry");
      this.forceLooseGame();
      return true;
  }*/ 


countdown: number;
  constructor(private questionService: QuestionService
  ,private authService: AuthService, private router: Router,private db: AngularFireDatabase
  ) {

     history.pushState(null, null, 'questions');
      window.addEventListener('popstate', function(event) {
      history.pushState(null, null, 'questions');
      });
       if(!authService.isLoggedIn())
          {
          console.log("wylogowani question panel")
          this.router.navigate(['/']);
        }
      this.authService.getCurrentLoggedUser().subscribe(user => this.actualUser = user);
    this.isStart = false; 
    this.isEnd = false;
    this.questionNumber = 0;
    this.gameId = this.questionService.gameId;
    this.questionService.getGameById(this.questionService.gameId).subscribe(game => 
    {
     

      this.game = game;
      this.loadQuestionsFromBase();
      this.roundNumber =  Object.values(this.game.categoryRounds).length;
      console.log(this.roundNumber);
  
      if(this.actualUser.email == this.game.user1.email)
      {
        this.actualGameUser = this.game.user1 
        this.userGameString = "user1";
        this.actualGameOpponent = this.game.user2;
      }
      else
      {
          this.actualGameUser= this.game.user2;
          this.userGameString = "user2";
          this.actualGameOpponent = this.game.user1;

      }
      this.gameUserLastAnswers = Object.values(this.actualGameUser.stateOfLastAnswers);
      if(this.isStart)
            {
                this.newQuestion();
            }
    }) 
  }

  forceLooseGame(){
    for(let i=0;i<3;i++)
    {
      this.actualGameUser.stateOfLastAnswers[i].state = -1;
    }
    this.actualGameUser.myTurn = false;
    this.updateGameUser();
  }

  loadQuestionsFromBase()
  { 
        this.categoryName = this.game.actualCategoryName;
        let categoryRounds  = Object.values(this.game.categoryRounds)
        for(let categoryRound of categoryRounds){
          if(categoryRound.categoryName == this.categoryName)
          {
            this.categoryRound=categoryRound;
            break;
          }
        }
        //todo oblusga bledow jak by nie ebylo categoryRound
        this.choosenQuestionsId = this.categoryRound.choosenQuestionId
        //if(this.questionsId==null){}....
        //pobieram z bazy te questions id ktore zostały wylosowane wczesniej
        this.questionService.getCategories().subscribe(categories => 
        {
              //najpierw musze znalezc ta kategorie
              for(let category of categories)
              {
                if(category.name == this.game.actualCategoryName)
                  {
                    this.category = category;
                   
                    break;
                  }
              }
              //wybieram pytania z tej kategori - queistions id
              this.questions=[];
             
                  for(let ids of this.choosenQuestionsId)
                  {
                     for(let idsQ of this.category.questions)
                     {
                        if(idsQ.id == ids.questionId)
                          {
                              this.questions.push(idsQ);
                              break;
                          }
                     }
                
                  }
        })
  }

 startTimer()
  {
    this.countdown = 100;
     const interval = 500;
    const duration = 5 * 1000;
    this.timer = Observable.timer(0, interval)
     

      .takeUntil(Observable.timer(duration + interval))
      .map(value => duration - value * interval)
      
       .finally(() => 
       {
       
       }
      );


    this.subscription = this.timer.subscribe(value =>
      {
        this.countdown = value/1000 * 20;
        if(this.countdown==0)
        {
            this.endQuestion(-1,true);  
        }
        this.setProgressBar();
      }
    );
  }
  newQuestion()
  {
   
    if(!this.isStart && this.questions!=undefined)
    {
       this.goodOrBadAnswerText = "";
        this.isEnd = false;
        this.question = this.questions[this.questionNumber];
        this.answers = Object.values(this.question.answers);
        this.answers = this.questionService.shuffle(this.answers);
        this.isStart=true;
        this.startTimer();
        if(this.questionNumber!=0)
          this.resetAnswerChecks();
    }
    
  }
  endQuestion(status: number,endTime:boolean,num?: number)
  {
    this.isEnd = true;
    this.isStart = false;
    this.actualGameUser.stateOfLastAnswers[3*(this.roundNumber-1) + this.questionNumber].state = status;
    this.updateGameUser();
    let comment = "";
    //kolorowanie odpowiedzi
    //koniec czasu to poprawna na zielono tylko 
    if(endTime)
    {
      this.checkGoodAnswer();
      this.goodOrBadAnswerText = "Przekroczyłeś czas na odpowiedź!"
    }
    else
    {
      let choosed = document.getElementById("a"+num);
      if(status == -1)
      { 
        choosed.setAttribute('class',"answer answer-bad");
        this.checkGoodAnswer();
        this.goodOrBadAnswerText = "Błędna odpowiedź!"

      }
      else
      {
          this.goodOrBadAnswerText = "Dobra odpowiedź!"
          choosed.setAttribute('class',"answer answer-good");
      }
    } 
    this.questionNumber+=1;
  }
  resetAnswerChecks()
  {
    for(let index = 0;index<this.answers.length;index++)
      {
          let ans = document.getElementById("ans"+index);
          if(ans!=null)
             ans.setAttribute('class',"answer");
          break;
      }
  }
  checkGoodAnswer()
  {
    for(let index = 0;index<this.answers.length;index++)
    {
      if(this.answers[index].isCorrect)
      {
          let good = document.getElementById("a"+index);
          good.setAttribute('class',"answer answer-good");
          break;
      }
    }
  }
  answer(num:number) {
    if(!this.isEnd)
    {
        this.subscription.unsubscribe();
        let state = 0;
        if(this.answers[num].isCorrect)
        {
          state = 1;
          this.actualGameUser.points++;
        }
        else
            state = -1;
        this.endQuestion(state,false,num);

    }
   
  }

  setProgressBar()
  {
    var a = document.getElementById('progressBar');
        if(this.countdown>50)
          a.setAttribute('class',"progress-bar progress-bar-success");
        else if(this.countdown<50 && this.countdown>20)
           a.setAttribute('class',"progress-bar progress-bar-warning");
        else if(this.countdown<=20)
           a.setAttribute('class',"progress-bar progress-bar-danger");


         a.setAttribute('aria-valuenow',this.countdown.toString()); // "/"
         a.setAttribute('style',"width:"+this.countdown.toString()+"%"); // "/"


  }
  updateGameUser()
  {
    if(this.questionNumber==2)
    {
        this.actualGameUser.myTurn=false;
    }
    this.db.database.ref('/games/' + this.gameId +'/' + this.userGameString).update(this.actualGameUser);
  }

  ngOnInit() {
    
    }
    back()
    {
      this.router.navigate(['/game']);
    }

 
}
