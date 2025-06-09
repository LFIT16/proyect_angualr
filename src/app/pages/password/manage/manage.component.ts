import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Password } from '../../../models/Passwords/password.model';
import { User } from '../../../models/Users/user.model';
import { PasswordService } from '../../../services/Password/password.service';
import { UserService } from '../../../services/User/user.service';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  password: Password;
  users: User[] = []; // Lista de usuarios
  theFormGroup: FormGroup; // Policía de formulario
  trySend: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private passwordsService: PasswordService,
    private router: Router,
    private theFormBuilder: FormBuilder,
    private userService: UserService, 
  ) {
    this.trySend = false;
    // Inicializar fechas como null para que el validador required funcione
    this.password = { id: 0, user_id: [], content: '', startAt: null, endAt: null, created_at: null, updated_at: null };
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
      this.password.id = this.activatedRoute.snapshot.params.id;
      this.getPassword(this.password.id); // Pasar como string
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
      content: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]], // null por defecto
      startAt: ['', [Validators.required]], // <--- Agrego Validators.required
      endAt: ['', [Validators.required]],   // <--- Agrego Validators.required
    })
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls
  }

  getPassword(id: number) {
    this.passwordsService.view(id).subscribe({
      next: (response) => {
        this.password = response;
        // Formatear fechas para el input tipo datetime-local
        this.theFormGroup.patchValue({
          id: this.password.id,
          user_id: this.password.user_id,
          content: this.password.content,
          startAt: this.password.startAt ? this.formatForInput(this.password.startAt) : '',
          endAt: this.password.endAt ? this.formatForInput(this.password.endAt) : '',
        });
        console.log('Password fetched successfully:', this.password);
      },
      error: (error) => {
        console.error('Error fetching password:', error);
      }
    });
  }
  back() {
    this.router.navigate(['/passwords/list']);
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
    // Formatear fechas a 'YYYY-MM-DD HH:mm:ss' antes de enviar
    const formValue = { ...this.theFormGroup.value };
    if (formValue.startAt) {
      formValue.startAt = this.formatDateTime(formValue.startAt);
    }
    if (formValue.endAt) {
      formValue.endAt = this.formatDateTime(formValue.endAt);
    }
    this.passwordsService.create(formValue).subscribe({
      next: (password) => {
        console.log('role created successfully:', password);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/passwords/list']);
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
    // Formatear fechas a 'YYYY-MM-DD HH:mm:ss' antes de enviar
    const formValue = { ...this.theFormGroup.value };
    if (formValue.startAt) {
      formValue.startAt = this.formatDateTime(formValue.startAt);
    }
    if (formValue.endAt) {
      formValue.endAt = this.formatDateTime(formValue.endAt);
    }
    this.passwordsService.update(formValue).subscribe({
      next: (password) => {
        console.log('Role updated successfully:', password);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/passwords/list']);
      },
      error: (error) => {
        console.error('Error updating role:', error);
      }
    });
  }

  // Utilidad para formatear fecha a 'YYYY-MM-DD HH:mm:ss'
  formatDateTime(dateString: string): string {
    if (!dateString) return '';
    // dateString viene como 'YYYY-MM-DDTHH:mm' o 'YYYY-MM-DDTHH:mm:ss'
    const [date, time] = dateString.split('T');
    if (!time) return date;
    // Si no hay segundos, los agregamos como 00
    const timeParts = time.split(':');
    if (timeParts.length === 2) {
      return `${date} ${time}:00`;
    }
    return `${date} ${time}`;
  }
  // Formatea fecha a 'YYYY-MM-DDTHH:mm' para el input
  formatForInput(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

}
