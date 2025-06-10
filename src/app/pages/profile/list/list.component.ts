import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { User } from '../../../models/Users/user.model';
import { ProfileService } from '../../../services/profile/profile.service';
import { UserService } from '../../../services/User/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  profiles: any[] = [];
  baseUrl: string = environment.url_ms_security + '/profiles';
  users:User[] = [];

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadProfiles();
    this.loadUsers();
  }

  loadProfiles(): void {
    this.profileService.getAll().subscribe({
      next: (data) => {
        this.profiles = data;
      },
      error: (err) => {
        console.error('Error loading profiles', err);
      }
    });
  }
  loadUsers() {
    this.userService.list().subscribe({
      next: (users) => { this.users = users; },
      error: () => { this.users = []; }
    });
  }
  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.name : '';
  }

  getPhotoUrl(photo: string): string {
    return photo ? `${environment.url_ms_security}/static/uploads/${photo}` : 'assets/img/default-avatar.png';
  }

  create(): void {
    // Aquí usas el userId real del usuario a asociar (ejemplo 1)
    this.router.navigate(['/profiles/create', 1]);
  }

  edit(profileId: number): void {
    this.router.navigate(['/profiles/edit', profileId]);
  }
  view(id:number){
    this.router.navigate(['/profiles/view/'+id]);
  }

  delete(profileId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este perfil?')) {
      this.profileService.delete(profileId).subscribe({
        next: () => {
          this.loadProfiles(); // recarga lista
        },
        error: (err) => {
          console.error('Error deleting profile', err);
        }
      });
    }
  }
}
