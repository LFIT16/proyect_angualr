import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { TrackerService } from 'app/services/tracker.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private listTitles: any[];
  location: Location;
  mobile_menu_visible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
  mostVisited: string = ''; // 👉 añadimos esto

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private trackerService: TrackerService
  ) {
    this.location = location;
    this.sidebarVisible = false;

    this.trackerService.track(this.router.url);
    this.mostVisited = this.getReadableRoute(this.trackerService.getMostVisited());

    this.router.events.subscribe(event => {
  if (event instanceof NavigationEnd) {
    this.trackerService.track(event.urlAfterRedirects);
    this.mostVisited = this.getReadableRoute(this.trackerService.getMostVisited());
  }
    });
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];

    this.router.events.subscribe((event) => {
      this.sidebarClose();
      const $layer: any = document.getElementsByClassName('close-layer')[0];
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
    });

    this.mostVisited = this.getReadableRoute(this.trackerService.getMostVisited());
  }

  // 👉 Traduce rutas a nombres bonitos
  getReadableRoute(route: string): string {
    const map: any = {
      '/dashboard': 'Dashboard',
      '/infracciones': 'Infracciones',
      '/firmas': 'Firmas Digitales',
      '/reportes': 'Reportes',
    };
    return map[route] || route;
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName('body')[0];
    setTimeout(() => {
      toggleButton.classList.add('toggled');
    }, 500);
    body.classList.add('nav-open');
    this.sidebarVisible = true;
  }

  sidebarClose() {
    const body = document.getElementsByTagName('body')[0];
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    body.classList.remove('nav-open');
  }

  sidebarToggle() {
    const $toggle = document.getElementsByClassName('navbar-toggler')[0];
    const body = document.getElementsByTagName('body')[0];
    let $layer: any;

    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }

    if (this.mobile_menu_visible == 1) {
      body.classList.remove('nav-open');
      if ($layer) {
        $layer.remove();
      }
      setTimeout(() => {
        $toggle.classList.remove('toggled');
      }, 400);
      this.mobile_menu_visible = 0;
    } else {
      setTimeout(() => {
        $toggle.classList.add('toggled');
      }, 430);

      $layer = document.createElement('div');
      $layer.setAttribute('class', 'close-layer');

      if (body.querySelectorAll('.main-panel')) {
        document.getElementsByClassName('main-panel')[0].appendChild($layer);
      } else if (body.classList.contains('off-canvas-sidebar')) {
        document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
      }

      setTimeout(() => {
        $layer.classList.add('visible');
      }, 100);

      $layer.onclick = function () {
        body.classList.remove('nav-open');
        this.mobile_menu_visible = 0;
        $layer.classList.remove('visible');
        setTimeout(() => {
          $layer.remove();
          $toggle.classList.remove('toggled');
        }, 400);
      }.bind(this);

      body.classList.add('nav-open');
      this.mobile_menu_visible = 1;
    }
  }

  getTitle() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    for (let item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }
}
