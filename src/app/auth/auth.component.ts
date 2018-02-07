import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { MainMenuService } from '../main-menu/main-menu.service';

@Component({
  selector: 'quiz-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
error: string = '';
user = {
   email: '',
   password: ''
};
  constructor(private authService: AuthService, private router: Router,private mainMenuService: MainMenuService) 
  {
    
  }

    signInWithGoogle() {
      this.authService.signInWithGoogle()
      .then((res) => {
        this.error = '';
        this.router.navigate(['/main-menu'])
      })
      .catch((err) => {
        this.error = err;
        console.error(err)
      });
    }

  createUser() {
    this.authService.createUser(this.user.email, this.user.password)
      .then((res) => {  
        this.error = '';
        this.router.navigate(['/main-menu']);
      })
      .catch((err) =>{
        this.error = err;
        console.error('error: ' + err)
      });
}
signIn() {
  this.authService.signIn(this.user.email, this.user.password)
      .then((res) => {  
        this.error = '';
        console.log("Tu zalogowanie");
        this.router.navigate(['/main-menu']);
      })
      .catch((err) => {
        this.error = err;
        console.error('error: ' + err)}
      );
}
  ngOnInit() {
  }

}