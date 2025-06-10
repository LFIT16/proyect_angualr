import { Component} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouteTrackerService } from './services/route-tracker-service.service'; // Adjust the path as necessary


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
constructor(
    private router: Router,
    private routeTracker: RouteTrackerService
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const route = (event as NavigationEnd).urlAfterRedirects;
      this.routeTracker.track(route);
    });
  }

}
