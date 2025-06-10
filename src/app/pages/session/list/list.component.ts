import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Session } from '../../../models/Sessions/session.model';
import { SessionService } from '../../../services/Session/session.service';
import { User } from '../../../models/Users/user.model';
import { UserService } from '../../../services/User/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  sessions: Session[] = [];
  users: User[] = [];
  constructor(private sessionsService:SessionService,
    private router:Router,
    private userService: UserService    
  ) { }

  ngOnInit(): void {
    this.list();
    this.loadUsers();
  }

  list(){
    this.sessionsService.list().subscribe({
      next: (sessions) => {
        this.sessions = sessions;
      }
    });
  }
   loadUsers() {
    this.userService.list().subscribe({
      next: (users) => { this.users = users; },
      error: () => { this.users = []; }
    });
  }
  create(){
    this.router.navigate(['/session/create']);
  }
  view(id: string){
    this.router.navigate(['/session/view/'+id]);
  }
  edit(id: string){
    this.router.navigate(['/session/update/'+id]);
  }
  delete(id: string){
    console.log("Delete user with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está seguro que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sessionsService.delete(id).
          subscribe(data => {
            Swal.fire(
              'Eliminado!',
              'Registro eliminado correctamente.',
              'success'
            )
            this.ngOnInit();
          });
      }
    })
  }
   getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.name : '';
  }

}
