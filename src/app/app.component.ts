import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
//below is to selectively display sidebar one specific routes
export class AppComponent implements OnInit {
  title = 'Learners';
  nav: boolean = false;
  constructor(private location: Location, private router: Router){
    this.router.events.subscribe((val) => {
      const publicPaths = [
        "",
        "/home",
        "/login",
        "/register",
        "/forgotPassword",
        "/setNewPassword"
      ];
      var currentPath =
        location.path() == ""
          ? location.path()
          : "/" + location.path().split("/")[1];
      //console.log(currentPath);
      if (publicPaths.includes(currentPath)) {
        //console.log(location.path() + "-->TRUE");
        this.nav = false;
      } else {
        this.nav = true;
      }

      // console.log("Cons :" + this.location.path() + " , " + this.nav);
    });
  }

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      const publicPaths = [
        "",
        "/home",
        "/login",
        "/register",
        "/notverified",
        "/verifyAccount",
        "/forgotPassword",
        "/setNewPassword",
      ];
      var currentPath =
        this.location.path() === ""
          ? this.location.path()
          : "/" + this.location.path().split("/")[1];
      //console.log(currentPath);
      if (publicPaths.includes(currentPath)) {
        this.nav = false;
      } else {
        this.nav = true;
      }
      //console.log("ngOn :" + this.location.path() + " , " + this.nav);
    });
  }


}
