import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Session } from '../../../models/Sessions/session.model';
import { User } from '../../../models/Users/user.model';
import { SessionService } from '../../../services/Session/session.service';
import { UserService } from '../../../services/User/user.service';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  sessions: Session;
  users: User[] = []; // Lista de usuarios
  theFormGroup: FormGroup; // Policía de formulario
  trySend: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private sessionsService: SessionService,
    private router: Router,
    private theFormBuilder: FormBuilder,
    private userService: UserService, 
  ) {
    this.trySend = false;
    // Inicializar fechas como null para que el validador required funcione
    this.sessions = { id:'', user_id:[], token:'', expiration: null, FACode: '',  created_at: null, updated_at: null };
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
    if (this.mode === 1) {
      this.theFormGroup.disable();
    }
    if (this.activatedRoute.snapshot.params.id) {
      this.sessions.id = this.activatedRoute.snapshot.params.id;
      this.getSessions(this.sessions.id.toString()); // Asegura que sea string
    }
    
  }
  loadUsers() {
    this.userService.list().subscribe({
      next: (users) => {
        this.users = users;
        console.log('Usuarios cargados:', this.users); // Para depuración
      },
      error: (err) => {
        this.users = [];
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      }
    });
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: ['', []],
      user_id: [null, [Validators.required]], // Cambiado de [] a null
      token: ['', [Validators.required]],
      expiration: [null, [Validators.required]],
      FACode: ['', [Validators.required]],
      created_at: [null, [Validators.required]],
      updated_at: [null, [Validators.required]],
    })
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls
  }

  getSessions(id: string) {
    this.sessionsService.view(id).subscribe({
      next: (response) => {
        this.sessions = response;
        // Formatear fechas para el input tipo datetime-local
        this.theFormGroup.patchValue({
          id: this.sessions.id,
          user_id: this.sessions.user_id,
          token: this.sessions.token,
          expiration: this.sessions.expiration ? this.formatForInput(this.sessions.expiration) : '',
          FACode: this.sessions.FACode,
          created_at: this.sessions.created_at ? this.formatForInput(this.sessions.created_at) : '',
          updated_at: this.sessions.updated_at ? this.formatForInput(this.sessions.updated_at) : '',
            
        });
        console.log('sessions fetched successfully:', this.sessions);
      },
      error: (error) => {
        console.error('Error fetching sessions:', error);
      }
    });
  }
  back() {
    this.router.navigate(['/session/list']);
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
    if (formValue.expiration) {
      formValue.expiration = this.formatDateTime(formValue.expiration);
    }
    // El backend espera user_id como número, no como array
    const userId = Array.isArray(formValue.user_id) ? formValue.user_id[0] : formValue.user_id;
    this.sessionsService.create(userId, formValue).subscribe({
      next: (sessions) => {
        console.log('role created successfully:', sessions);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/session/list']);
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
    if (formValue.expiration) {
      formValue.expiration = this.formatDateTime(formValue.expiration);
    }
    this.sessionsService.update(formValue.id, formValue).subscribe({
      next: (sessions) => {
        console.log('Role updated successfully:', sessions);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/session/list']);
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
