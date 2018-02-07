import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionPanelComponent } from './question-panel/question-panel.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    QuestionPanelComponent
  ],
  declarations: [QuestionPanelComponent],
})
export class QuestionModule { }
