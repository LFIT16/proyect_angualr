import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../../../models/Users/user.model';
import { UserService } from '../../../services/User/user.service';
import { Address } from '../../../models/Addresses/address.model';
import { AddressService } from '../../../services/Address/address.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  addresses: Address[] = [];
  users: User[] = [];
  constructor(
    private addressesService: AddressService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.list();
  }

  loadUsers() {
    this.userService.list().subscribe({
      next: (users) => { this.users = users; },
      error: () => { this.users = []; }
    });
  }

  list(){
    this.addressesService.list().subscribe({
      next: (addresses) => {
        this.addresses = addresses;
      }
    });
  }
  create(){
    this.router.navigate(['/addresses/create']);
  }
  view(id:number){
    this.router.navigate(['/addresses/view/'+id]);
  }
  edit(id:number){
    this.router.navigate(['/addresses/update/'+id]);
  }
  delete(id:number){
    console.log("Delete addresses with id:", id);
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
        this.addressesService.delete(id).
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
