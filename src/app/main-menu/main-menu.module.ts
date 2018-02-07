import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MainMenuPanelComponent } from './main-menu-panel/main-menu-panel.component';

const providers = [
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [MainMenuPanelComponent],
  declarations: [MainMenuPanelComponent]
})

export class MainMenuModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MainMenuModule,
      providers: providers,
    };
  }
 }
