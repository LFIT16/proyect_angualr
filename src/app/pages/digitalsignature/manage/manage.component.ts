import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DigitalSignatureService } from '../../../services/DigitalSignature/digitalsignature.service';
import { UserService } from '../../../services/User/user.service';
import { Digitalsignature } from '../../../models/DigitalSgnature/digitalsignature.model';
import { User } from '../../../models/Users/user.model';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  users: User[] = [];
  isEdit = false;
  mode = 2;
  selectedFile: File | null = null;
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private dsService: DigitalSignatureService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      id: [null],
      user_id: ['', [Validators.required]],
      photo: [null, [Validators.required]] // Cambiado a null como valor inicial
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.mode = this.router.url.includes('view') ? 1 : 3;
      }
    });
    this.loadUsers();
  }

  loadUsers(): void {
    this.subscriptions.add(
      this.userService.list().subscribe({
        next: (users) => this.users = users,
        error: (error) => {
          console.error('Error loading users:', error);
          this.showErrorMessage('Error al cargar los usuarios');
        }
      })
    );
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this.isValidImage(file)) {
        this.selectedFile = file;
        this.form.patchValue({ photo: file });
        this.form.get('photo')?.markAsTouched();
      } else {
        this.showErrorMessage('Por favor seleccione una imagen válida (JPG, PNG, GIF)');
        event.target.value = '';
      }
    }
  }

  private isValidImage(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return validTypes.includes(file.type);
  }

  create(): void {
    if (this.form.invalid || !this.selectedFile) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      this.showErrorMessage('Por favor complete todos los campos requeridos');
      return;
    }

    const formData = new FormData();
    formData.append('user_id', this.form.get('user_id')?.value);
    formData.append('photo', this.selectedFile, this.selectedFile.name);

    Swal.fire({
      title: 'Creando firma digital',
      text: 'Por favor espere...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.dsService.create(formData).subscribe({
      next: () => {
        this.showSuccessMessage('Firma digital creada exitosamente');
        this.router.navigate(['/digital-signatures/list']);
      },
      error: (error) => {
        console.error('Error creating signature:', error);
        this.showErrorMessage(error.error?.error || 'Error al crear la firma digital');
      }
    });
  }

  private showSuccessMessage(message: string): void {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
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

  back(): void {
    this.router.navigate(['/digital-signatures/list']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
