import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../../../models/Users/user.model';
import { UserService } from '../../../services/User/user.service';
import { Address } from '../../../models/Addresses/address.model';
import { AddressService } from '../../../services/Address/address.service';



@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit {
  mode: number; 
  address: Address;
  users: User[] = []; // Lista de usuarios
  theFormGroup: FormGroup; // Policía de formulario
  trySend: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private addressesService: AddressService,
    private router: Router,
    private theFormBuilder: FormBuilder,
    private userService: UserService, 
  ) {
    this.trySend = false;
    // Inicializar fechas como null para que el validador required funcione
    this.address = { id: 0, user_id: [],street:'', number: '', latitude:0, longitude:0, created_at: null, updated_at: null };
    this.configFormGroup()
  }

  ngOnInit(): void {
    this.loadUsers();
    const currentUrl = this.activatedRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
    if (this.activatedRoute.snapshot.params.id) {
      this.address.id = this.activatedRoute.snapshot.params.id;
      this.getAddresses(this.address.id); 
    }
    
  }
  loadUsers() {
    this.userService.list().subscribe({
      next: (users) => { this.users = users; },
      error: (err) => { this.users = []; }
    });
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: [0, []], // Cambiado a string vacío por defecto
      user_id: [[], [Validators.required]], // null por defecto
      street: ['', [Validators.required, Validators.minLength(3)]], // null por defecto
      number: ['', [Validators.required, Validators.minLength(3)]], // null por defecto
      latitude: [0, [Validators.required, Validators.min(-90), Validators.max(90)]], // null por defecto  
      longitude: [0, [Validators.required, Validators.min(-180), Validators.max(180)]], // null por defecto 
    })
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls
  }

  getAddresses(id: number) {
    this.addressesService.view(id).subscribe({
      next: (response) => {
        this.address = response;
        this.theFormGroup.patchValue({
          id: this.address.id,
          user_id: this.address.user_id,
          street: this.address.street,
          number: this.address.number,
          latitude: this.address.latitude,
          longitude: this.address.longitude,});
        console.log('addresses fetched successfully:', this.address);
      },
      error: (error) => {
        console.error('Error fetching addresses:', error);
      }
    });
  }
  back() {
    this.router.navigate(['/addresses/list']);
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos requeridos.',
        icon: 'error',
      })
      return;
    }
  
    this.addressesService.create(this.theFormGroup.value).subscribe({
      next: (addresses) => {
        console.log('Addresscreated successfully:', addresses);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/addresses/list']);
      },
      error: (error) => {
        console.error('Error creating role:', error);
      }
    });
  }
  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos requeridos.',
        icon: 'error',
      })
      return;
    }
 
    this.addressesService.update(this.theFormGroup.value).subscribe({
      next: (addresses) => {
        console.log('Address updated successfully:', addresses);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/addresses/list']);
      },
      error: (error) => {
        console.error('Error updating role:', error);
      }
    });
  }
  
}
