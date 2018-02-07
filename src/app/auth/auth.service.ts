import { Injectable , Output,EventEmitter} from '@angular/core';
import { Router } from "@angular/router";
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import "rxjs/add/observable/of";

// for database
import { AngularFireList } from 'angularfire2/database';
// for Observables
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';

import { User } from '../models/user'
import { ActualGames } from '../models/actualGames'
import { GameService } from '../game/game.service';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { MainMenuService } from '../main-menu/main-menu.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService{ 
  
  private firebaseUser: Observable<firebase.User>;
  private loginUser: firebase.User = null;
  private actualUser = new BehaviorSubject<User>({
        email : "",
        displayName : "",
        actualGames: [{gameId:""}],
        id:0
    });
  private allUsers: User[] = [];
constructor(private _firebaseAuth: AngularFireAuth, private router: Router, private db: AngularFireDatabase,
) { 
      if(this.isLoggedIn())
      {
          this.router.navigate(['/main-menu']);
      }
       this.firebaseUser = _firebaseAuth.authState;
      
        this.firebaseUser.subscribe(
            (user) => {
              if (user) 
              {
               this.loginUser = user;
                //tu zapisuje info czy zalogowany
               localStorage.setItem('user', JSON.stringify(user));
               this.loadUsers();
              } 
              else { 
                this.loginUser = null;
              }
            }
          );
      if(this.loginUser!=null && this.loginUser!=undefined)
          this.loadUsers();
  }

loadUsers() {
  let addNewOne = true;

  this.getUsersFromFireBase().subscribe((users) => {

    
    let currEmail = this.loginUser.email;
    let currName = this.formatName(this.loginUser);

    this.allUsers = Object.values(users);

    for(let us of this.allUsers)
    {
       if(us.email==this.loginUser.email)
       {
         console.log("tutaj dopiero");
         console.log(this.loginUser.email);
         let user2ActualGames;
          if(us.actualGames == null || us.actualGames == undefined){
            user2ActualGames =  [{gameId:""}];
          }
          else{
            user2ActualGames = us.actualGames;
          } 
          this.actualUser.next({
            email: us.email,
            displayName: us.displayName,
            actualGames: user2ActualGames,
            id: us.id
          }); 
        addNewOne = false;
        break;
       }
    }
   

    if(addNewOne){
      ;
      console.log("Adding new user to DB: " +  currEmail);
  

      let newUserkey = this.db.database.ref('/users').push({
        displayName: currName,
        email: currEmail,
        id: 0
      }).key;
      this.db.database.ref('/users/' + newUserkey +'/').update({
        id: newUserkey
      })
      addNewOne = false;
      this.loadUsers();


    } 

  });
}
ngOnInit()
{
  
}

getUsersFromFireBase() :FirebaseListObservable<any[]> {
    return this.db.list('/users');
  }

isLoggedIn() {
  if (this.loginUser == null ) {
       let us = JSON.parse(localStorage.getItem('user'));
      if(us==null)
        return false; 
      else
      {
        this.loginUser = us;   
        return true;
      }
    } else {
      return true;
    }
  }

signInWithGoogle() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    )
  }
  logout() {
     localStorage.clear();
      this._firebaseAuth.auth.signOut()
      .then((res) => this.router.navigate(['/']));

    }

  createUser(email, password) 
  {
   const credential = firebase.auth.EmailAuthProvider.credential( email, password );
   return this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
  }

  signIn(email, password) 
  {
   const credential = firebase.auth.EmailAuthProvider.credential( email, password );
   return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password)
  }

  getCurrentLoggedUser():Observable<User>
  {
    return this.actualUser.asObservable();
  }

  formatName(user){
    if(user.displayName == null || user.displayName == ''){
      if(user.email.indexOf('@') > -1)
        return user.email.substring(0, user.email.indexOf('@'));
      else
        return user.email;
    }
    else return user.displayName
  }

}

