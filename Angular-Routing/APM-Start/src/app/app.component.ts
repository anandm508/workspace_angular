import {
  Router,
  Event,
  NavigationStart,
  NavigationCancel,
  NavigationError,
  NavigationEnd
} from "@angular/router";
import { Component } from "@angular/core";

import { AuthService } from "./user/auth.service";
import { slideInAnimation } from "./app.animation";
import { MessageService } from "./messages/message.service";

@Component({
  selector: "pm-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  animations: [slideInAnimation]
})
export class AppComponent {
  pageTitle = "Acme Product Management";
  loading = false;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get userName(): string {
    if (this.authService.currentUser) {
      return this.authService.currentUser.userName;
    }
    return "";
  }

  get isMessageDisplayed(): boolean {
    return this.messageService.isDisplayed;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (
        event instanceof NavigationCancel ||
        event instanceof NavigationEnd ||
        event instanceof NavigationError
      ) {
        this.loading = false;
      }
    });
  }

  logOut(): void {
    this.authService.logout();
    console.log("Log out");
    this.router.navigate(["welcome"]);
  }

  showMessages(): void {
    this.messageService.isDisplayed = true;
    this.router.navigate([{ outlets: { popup: ["messages"] } }]);
  }

  hideMessages(): void {
    this.messageService.isDisplayed = false;
    this.router.navigate([{ outlets: { popup: null } }]);
  }
}
