import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GamePanelComponent } from './game-panel/game-panel.component';
import { SelectOpponentComponent } from './select-opponent/select-opponent.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [GamePanelComponent],
  declarations: [GamePanelComponent, SelectOpponentComponent]
})
export class GameModule { }
 