import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Device } from '../../../models/Device/device.model';
import { DeviceService } from '../../../services/Device/device.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  devices: Device[] = [];
  
  constructor(
    private deviceService: DeviceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices() {
    this.deviceService.list().subscribe({
      next: (response) => {
        console.log('Devices received:', response); // Debug log
        this.devices = response;
      },
      error: (error) => {
        console.error('Error loading devices:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los dispositivos',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  create() {
    this.router.navigate(['/device/create']);
  }

  view(id: number) {
    this.router.navigate(['/device/view', id]);
  }

  edit(id: number) {
    this.router.navigate(['/device/update', id]);
  }

  delete(id: number) {
    Swal.fire({
      title: '¿Está seguro?',
      text: "¿Desea eliminar este dispositivo?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deviceService.delete(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado!',
              'El dispositivo ha sido eliminado.',
              'success'
            );
            this.loadDevices(); // Recargar la lista
          },
          error: (error) => {
            console.error('Error deleting device:', error);
            Swal.fire(
              'Error',
              'No se pudo eliminar el dispositivo',
              'error'
            );
          }
        });
      }
    });
  }
}
