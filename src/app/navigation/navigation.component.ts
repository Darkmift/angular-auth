import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  private authStatusSub: Subscription;
  isLoggedIn: boolean = false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        console.log(
          '🚀 ~ file: navigation.component.ts ~ line 17 ~ NavigationComponent ~ ngOnInit ~ this.isLoggedIn',
          this.isLoggedIn
        );
        this.isLoggedIn = authStatus;
      });
  }

  ngOnDestroy() {
    if (this.authStatusSub !== undefined) {
      this.authStatusSub.unsubscribe();
    }
  }

  logout() {
    this.authService.logOut();
  }
}
