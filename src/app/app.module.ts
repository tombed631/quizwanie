import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { environment } from './../environments/environment';

import { AppComponent } from './app.component';
import { CategoryModule } from './category/category.module';
import { QuestionModule } from './question/question.module';
import { GameModule } from './game/game.module';
import { MainMenuModule } from './main-menu/main-menu.module';

import { CategoryService } from './category/category.service';
import { GameService } from './game/game.service';
import { QuestionService } from './question/question.service';
import { MainMenuService } from './main-menu/main-menu.service';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth/auth.service';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthComponent } from './auth/auth.component';
import { FormsModule } from '@angular/forms';


// import { SelectCategoryComponent } from './category/select-category/select-category.component';
// import { MainMenuPanelComponent } from './main-menu/main-menu-panel/main-menu-panel.component';
// import { QuestionPanelComponent } from './question/question-panel/question-panel.component';
// import { GamePanelComponent } from './game/game-panel/game-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    CategoryModule,
    QuestionModule,
    GameModule,
    FormsModule,
    CategoryModule,
    MainMenuModule,
    HttpModule,
    AppRoutingModule,
    RouterModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  //  RouterModule.forRoot([
  //   //   { path: 'categories', component: <any>SelectCategoryComponent },
  //      { path: 'main-menu', component: <any>MainMenuPanelComponent }
  //   //   { path: 'game', component: <any>GamePanelComponent },
  //   //   { path: 'question', component: <any>QuestionPanelComponent }
  //  ])
  ],
  providers: [CategoryService, GameService, QuestionService, MainMenuService, AngularFireDatabase
  ,AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
