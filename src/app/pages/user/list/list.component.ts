import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../../../models/Users/user.model';
import { UserService } from '../../../services/User/User.service';
import { TrackerService } from '../../../services/tracker.service'; // 👈 Importa el servicio


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  users: User[] = [];
  constructor(private UserService:UserService,
    private router:Router
    , private trackerService: TrackerService // 👈 Inyecta el servicio
  ) { }

  ngOnInit(): void {
    this.trackerService.track('Usuarios - Lista');
    this.list();

  }

  list(){
    this.UserService.list().subscribe({
      next: (users) => {
        this.users = users;
      }
    });
  }
  create(){
    this.router.navigate(['/users/create']);
  }
  view(id:number){
    this.router.navigate(['/users/view/'+id]);
  }
  edit(id:number){
    this.router.navigate(['/users/update/'+id]);
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
        this.UserService.delete(id).
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
