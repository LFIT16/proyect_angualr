import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Session } from '../../../models/Sessions/session.model';
import { SessionService } from '../../../services/Session/session.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  sessions: Session[] = [];
  constructor(private sessionsService:SessionService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.list();
  }

  list(){
    this.sessionsService.list().subscribe({
      next: (sessions) => {
        this.sessions = sessions;
      }
    });
  }
  create(){
    this.router.navigate(['/sessions/create']);
  }
  view(id:number){
    this.router.navigate(['/sessions/view/'+id]);
  }
  edit(id:number){
    this.router.navigate(['/sessions/update/'+id]);
  }
  delete(id:number){
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

}
