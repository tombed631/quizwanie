import { ActualGames } from "./actualGames";

export class User {
   displayName: string;
   email: string;
   actualGames: ActualGames[];
   id:number
   constructor(displayName: string,email:string,wins:number,actualGames:ActualGames[], id:number)
   {
       this.actualGames=actualGames;
       this.displayName = displayName;
       this.email = email;
       this.id = id;
   }
}
