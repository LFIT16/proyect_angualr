import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/users/list', title: 'Usuarios', icon:'person', class: ''},
    { path: '/user-roles/list', title: 'Rol de usuario',  icon:'library_books', class: '' },
    { path: '/roles/list', title: 'Roles',  icon:'content_paste', class: '' },
    { path: '/passwords/list', title: 'Contraseñas',  icon:'unarchive', class: 'active-pro' },
    { path: '/addresses/list', title: 'Dirección',  icon:'location_on', class: '' },
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    {
      path: '/devices/list',
      title: 'Dispositivos',
      icon: 'devices',
      class: ''
    },
    {
      path: '/security-questions/list',
      title: 'Preguntas de Seguridad',
      icon: 'security',
      class: ''
    },
    {
      path: '/answers/list',
      title: 'Respuestas',
      icon: 'question_answer',
      class: ''
    },
    { path: '/digital-signatures/list', title: 'Firmas Digitales',  icon: 'draw', class: '' },
    { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
    { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    // Nuevos accesos directos:
    { path: '/profiles/list', title: 'Perfiles', icon: 'account_circle', class: '' },
    { path: '/permissions/list', title: 'Permisos', icon: 'vpn_key', class: '' },
    { path: '/role-permissions/list', title: 'Rol-Permiso', icon: 'supervisor_account', class: '' },
    { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
