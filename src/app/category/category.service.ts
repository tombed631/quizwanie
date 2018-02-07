import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Category } from '../models/category';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
//import { AngularFire, AuthProviders, AuthMethods,FirebaseListObservable } from 'angularfire2';

import 'rxjs'
import { Game } from '../models/game';

@Injectable()
export class CategoryService {
  game: Game;
  constructor(private db: AngularFireDatabase) { }
  
  getGameById(id: string): Observable<Game>{
    return this.db.object('/games/' + id);
  }
  setGame(game: Game)
  {
    this.game = game;
  }
  getCategories(): Observable<Category[]> {
    return this.db.list('/categories');
  }

  getCategory(): Observable<Category> {
    return this.db.object('/categories');
  }
}
