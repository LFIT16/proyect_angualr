import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { User } from '../../../models/Users/user.model';
import { ProfileService } from '../../../services/profile/profile.service';
import { UserService } from '../../../services/User/user.service';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  isEdit: boolean = false;
  isView: boolean = false;
  isReadOnly: boolean = true; // Nuevo: controla si el formulario está en solo lectura
  profileId?: number;
  userId: number;
  users: User[] = [];
  form: any = {
    phone: ''
  };
  photoPreview?: string;
  photoFile?: File;
  baseUrl: string = `${environment.url_ms_security}/profiles`;
  errorMsg: string = '';
  theFormGroup: FormGroup; // Policía de formulario
  mode: number = 1; // 1: Detalle, 2: Crear, 3: Actualizar


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private userService: UserService,
    private theFormBuilder: FormBuilder,

  ) { this.configFormGroup() }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.profileId = params['id'] ? +params['id'] : undefined;
      this.userId = params['userId'] ? +params['userId'] : undefined;
      // Cambiar 'edit' por 'update' para detectar correctamente el modo edición
      this.isEdit = !!this.profileId && this.route.snapshot.routeConfig?.path?.startsWith('update');
      this.isView = !!this.profileId && this.route.snapshot.routeConfig?.path?.startsWith('view');
      // Lógica para el modo
      if (this.isView) {
        this.mode = 1; // Detalle
        this.isReadOnly = true;
      } else if (this.isEdit) {
        this.mode = 3; // Actualizar
        this.isReadOnly = false;
      } else {
        this.mode = 2; // Crear
        this.isReadOnly = false;
      }
      // Configurar el formulario con el estado correcto
      this.configFormGroup();
      // Cargar la lista de usuarios siempre al iniciar
      this.loadUsers();
      if ((this.isEdit || this.isView) && this.profileId) {
        this.profileService.getById(this.profileId).subscribe({
          next: (data) => {
            this.theFormGroup.patchValue({
              phone: data.phone,
              user_id: data.user_id
            });
            if (data.photo) {
              this.photoPreview = `${this.baseUrl}/${data.photo}`;
            }
            // Habilitar/deshabilitar controles según el modo
            if (this.isReadOnly) {
              Object.keys(this.theFormGroup.controls).forEach(key => {
                this.theFormGroup.get(key)?.disable();
              });
            } else {
              Object.keys(this.theFormGroup.controls).forEach(key => {
                this.theFormGroup.get(key)?.enable();
              });
            }
          },
          error: (err) => this.errorMsg = 'Error cargando el perfil'
        });
      }
    });
  }
   get getTheFormGroup() {
    return this.theFormGroup.controls
  }
  loadUsers() {
    this.userService.list().subscribe({
      next: (users) => { this.users = users; },
      error: (err) => { this.users = []; }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.photoFile = file;
      const reader = new FileReader();
      reader.onload = e => this.photoPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  enableEdit() {
    this.isReadOnly = false;
    this.mode = 3; // Cambia a modo Actualizar
    Object.keys(this.theFormGroup.controls).forEach(key => {
      this.theFormGroup.get(key)?.enable();
    });
  }

  onSubmit(): void {
    if (this.isReadOnly || this.isView) return; // No permitir submit en modo solo lectura o vista
    this.errorMsg = '';
    if (this.theFormGroup.invalid) {
      this.errorMsg = 'El teléfono es obligatorio y debe tener 10 dígitos';
      return;
    }
    const formValue = this.theFormGroup.value;
    if (this.mode === 3 && this.profileId) {
      // Actualizar
      this.profileService.update(this.profileId, formValue, this.photoFile || null).subscribe({
        next: () => this.router.navigate(['/profiles']),
        error: (err) => this.errorMsg = 'Error actualizando el perfil'
      });
    } else if (this.mode === 2 && formValue.user_id) {
      // Crear
      this.profileService.create(formValue.user_id, formValue, this.photoFile || null).subscribe({
        next: () => this.router.navigate(['/profiles']),
        error: (err) => this.errorMsg = 'Error creando el perfil'
      });
    } else {
      this.errorMsg = 'No se encontró el usuario para el perfil';
    }
  }
  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: [0, []],
      user_id: [{ value: null, disabled: this.isReadOnly }, [Validators.required]],
      phone: [{ value: '', disabled: this.isReadOnly }, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      photo: [{ value: null, disabled: this.isReadOnly }, []],
    });
  }

  goBack(): void {
    this.router.navigate(['/profiles/list']);
  }

  goToUpdate() {
    if (this.profileId) {
      this.router.navigate(['/profiles/update', this.profileId]);
    }
  }
}
