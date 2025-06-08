import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Device } from '../../../models/Device/device.model';
import { User } from '../../../models/Users/user.model';
import { DeviceService } from '../../../services/Device/device.service';
import { UserService } from '../../../services/User/User.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  device: Device;
  users: User[] = [];
  theFormGroup: FormGroup;
  trySend: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private deviceService: DeviceService,
    private router: Router,
    private theFormBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.trySend = false;
    this.device = {
  id: 0,
  user_id: [],
  ip: '',
  name: '',
  operating_system: '',
  created_at: null,
  updated_at: null
};

    this.configFormGroup();
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
      this.device.id = this.activatedRoute.snapshot.params.id;
      this.getDevice(this.device.id);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      ip: ['', [Validators.required, Validators.pattern('^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$')]],
      operating_system: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      user_id: [[], [Validators.required]],
      created_at: [null],
      updated_at: [null],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  loadUsers() {
    this.userService.list().subscribe({
      next: (users) => { this.users = users; },
      error: (err) => {
        this.users = [];
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      }
    });
  }

  getDevice(id: number) {
    this.deviceService.view(id).subscribe({
      next: (response) => {
        this.device = response;
        this.theFormGroup.patchValue({
          id: this.device.id,
          name: this.device.name,
          ip: this.device.ip,
          operating_system: this.device.operating_system,
          user_id: this.device.user_id,
          created_at: this.device.created_at,
          updated_at: this.device.updated_at,
        });
      },
      error: (error) => {
        console.error('Error fetching device:', error);
        Swal.fire('Error', 'No se pudo cargar el dispositivo', 'error');
      }
    });
  }

  back() {
    this.router.navigate(['/devices/list']);
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor, complete todos los campos requeridos.', 'error');
      return;
    }

    const formValue = { ...this.theFormGroup.value };
    formValue.created_at = new Date();
    formValue.updated_at = new Date();

    this.deviceService.create(formValue).subscribe({
      next: () => {
        Swal.fire('Creado', 'Dispositivo creado correctamente.', 'success');
        this.router.navigate(['/devices/list']);
      },
      error: (error) => {
        console.error('Error creando dispositivo:', error);
        Swal.fire('Error', 'No se pudo crear el dispositivo', 'error');
      }
    });
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor, complete todos los campos requeridos.', 'error');
      return;
    }

    const formValue = { ...this.theFormGroup.value };
    formValue.updated_at = new Date();

    this.deviceService.update(formValue).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'Dispositivo actualizado correctamente.', 'success');
        this.router.navigate(['/devices/list']);
      },
      error: (error) => {
        console.error('Error actualizando dispositivo:', error);
        Swal.fire('Error', 'No se pudo actualizar el dispositivo', 'error');
      }
    });
  }
}
