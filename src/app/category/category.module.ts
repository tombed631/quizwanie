import { NgModule, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SelectCategoryComponent } from './select-category/select-category.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    SelectCategoryComponent
  ],
  declarations: [
    SelectCategoryComponent
  ],
})
export class CategoryModule implements OnInit {

  constructor() {
  }

  ngOnInit() {
    
  }
}
