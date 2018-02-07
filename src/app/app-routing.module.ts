import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { MainMenuPanelComponent } from './main-menu/main-menu-panel/main-menu-panel.component';
import { QuestionPanelComponent } from './question/question-panel/question-panel.component';
import { GamePanelComponent } from './game/game-panel/game-panel.component';
import { SelectCategoryComponent } from './category/select-category/select-category.component';
import { SelectOpponentComponent } from './game/select-opponent/select-opponent.component';

const routes: Routes = [
   { path: '', component: AuthComponent },
   { path: 'main-menu',component: MainMenuPanelComponent,},
    { path: 'category', component: SelectCategoryComponent },
    { path: 'questions', component: QuestionPanelComponent },
    { path: 'select-opponent', component: SelectOpponentComponent},
    { path: 'game', component: GamePanelComponent},
    { path: '**', component: MainMenuPanelComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

export const routedComponents = [ ];