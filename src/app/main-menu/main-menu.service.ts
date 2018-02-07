import { Injectable } from '@angular/core';
import { User } from '../models/user'
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MainMenuService {

    actualUser: User;
    constructor(private authService: AuthService)
    {
        

    }

   setActualUser(user: User)
  {
      this.actualUser = user;
    
  }

}
