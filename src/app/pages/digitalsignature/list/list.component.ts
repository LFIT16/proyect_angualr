import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Digitalsignature } from '../../../models/DigitalSgnature/digitalsignature.model';
import { DigitalSignatureService } from '../../../services/DigitalSignature/digitalsignature.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  digitalSignatures: Digitalsignature[] = [];

  constructor(
    private digitalSignatureService: DigitalSignatureService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSignatures();
  }

  loadSignatures(): void {
    this.digitalSignatureService.list().subscribe({
      next: (data) => this.digitalSignatures = data,
      error: (error) => {
        console.error('Error loading signatures:', error);
        this.showErrorMessage('Error al cargar las firmas digitales');
      }
    });
  }

  create(): void {
    this.router.navigate(['/digital-signatures/create']);
  }

  view(id: number): void {
    this.router.navigate(['/digital-signatures/view', id]);
  }

  edit(id: number): void {
    this.router.navigate(['/digital-signatures/update', id]);
  }

  deleteSignature(id: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.digitalSignatureService.delete(id).subscribe({
          next: () => {
            this.loadSignatures();
            this.showSuccessMessage('Firma digital eliminada correctamente');
          },
          error: (error) => {
            console.error('Error deleting signature:', error);
            this.showErrorMessage('Error al eliminar la firma digital');
          }
        });
      }
    });
  }

  private showSuccessMessage(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: message,
      timer: 2000,
      showConfirmButton: false
    });
  }

  private showErrorMessage(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message
    });
  }
}
