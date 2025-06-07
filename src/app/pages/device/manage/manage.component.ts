import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from '../../../models/Device/device.model';
import { DeviceService } from '../../../services/Device/device.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit {
  mode: number = 0;
  device: Device;
  theFormGroup: FormGroup;
  trySend: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private deviceService: DeviceService,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.device = {
      id: 0,
      name: '',
      ip: '',
      operating_system: '',
    };
    this.initForm();
  }

  private initForm(): void {
    this.theFormGroup = this.theFormBuilder.group({
      id: [0],
      user_id: [0],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      ip: ['', [Validators.required, Validators.pattern('^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$')]],
      operating_system: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      created_at: [new Date()],
      updated_at: [new Date()]
    });
}

  ngOnInit(): void {
    this.setMode();
    this.loadDevice();
  }

  private setMode(): void {
    const url = this.activatedRoute.snapshot.url;
    const path = url[url.length - 1].path;

    if (path === 'create') {
      this.mode = 2;
    } else if (path === 'view') {
      this.mode = 1;
    } else if (path === 'update') {
      this.mode = 3;
    }
  }

  private loadDevice(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.getDevice(id);
    }
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getDevice(id: number) {
    this.deviceService.view(id).subscribe({
      next: (response) => {
        this.device = response;
        this.theFormGroup.patchValue(this.device);
      },
      error: (error) => {
        console.error('Error fetching device:', error);
        Swal.fire('Error', 'No se pudo cargar el dispositivo', 'error');
      }
    });
  }

  back() {
    this.router.navigate(['/device/list']);
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
        Swal.fire('Error', 'Por favor, complete todos los campos requeridos.', 'error');
        return;
    }

    const newDevice: Device = {
        name: this.theFormGroup.get('name').value,
        ip: this.theFormGroup.get('ip').value,
        operating_system: this.theFormGroup.get('operating_system').value,
        user_id: this.theFormGroup.get('user_id').value,
        created_at: new Date(),
        updated_at: new Date()
    };

    this.deviceService.create(newDevice).subscribe({
        next: () => {
            Swal.fire('Éxito', 'Dispositivo creado correctamente.', 'success');
            this.router.navigate(['/device/list']);
        },
        error: (error) => {
            console.error('Error creating device:', error);
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

    this.deviceService.update(this.theFormGroup.value).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Dispositivo actualizado correctamente.', 'success');
        this.router.navigate(['/device/list']);
      },
      error: (error) => {
        console.error('Error updating device:', error);
        Swal.fire('Error', 'No se pudo actualizar el dispositivo', 'error');
      }
    });
  }
}
