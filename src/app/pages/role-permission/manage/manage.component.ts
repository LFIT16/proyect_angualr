import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RolePermissionService } from '../../../services/RolePermission/role-permission.service';
import { RoleService } from '../../../services/Role/role.service';
import { PermissionService } from '../../../services/permission/permission.service';
import Swal from 'sweetalert2';

interface RolePermission {
  id: string;
  role_id: number;
  permission_id: number;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html'
})
export class ManageComponent implements OnInit {
  form: FormGroup;
  mode: number = 2; // 1: detalle, 2: crear, 3: actualizar
  roles: any[] = [];
  permissions: any[] = [];
  loading: boolean = false;
  trySend: boolean = false;

  constructor(
    private fb: FormBuilder,
    private rolePermissionService: RolePermissionService,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      id: [null],
      role_id: [null, Validators.required],
      permission_id: [null, Validators.required],
      created_at: [null],
      updated_at: [null]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.mode = this.route.snapshot.url.some(segment => segment.path === 'view') ? 1 : 3;
      this.loadRolePermission(id);
    } else {
      this.mode = 2;
      this.form.enable();
    }
  }

  loadRoles(): void {
    this.roleService.list().subscribe({
      next: (roles) => this.roles = roles,
      error: () => Swal.fire('Error', 'No se pudieron cargar los roles', 'error')
    });
  }

  loadPermissions(): void {
    this.permissionService.list().subscribe({
      next: (permissions) => this.permissions = permissions,
      error: () => Swal.fire('Error', 'No se pudieron cargar los permisos', 'error')
    });
  }

  loadRolePermission(id: string): void {
    this.loading = true;
    this.rolePermissionService.view(id).subscribe({
      next: (response: RolePermission) => {
        this.form.patchValue({
          id: response.id,
          role_id: Number(response.role_id),
          permission_id: Number(response.permission_id),
          created_at: response.created_at,
          updated_at: response.updated_at
        });
        if (this.mode === 1) this.form.disable();
        else this.form.enable();
      },
      error: () => Swal.fire('Error', 'No se pudo cargar el rol-permiso', 'error'),
      complete: () => this.loading = false
    });
  }

  onSubmit(): void {
    this.trySend = true;

    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }

    this.loading = true;
    const role_id = Number(this.form.get('role_id')?.value);
    const permission_id = Number(this.form.get('permission_id')?.value);

    if (this.mode === 2) {
      // Crear
      this.rolePermissionService.create({ role_id, permission_id }).subscribe({
        next: () => {
          Swal.fire({
            title: 'Éxito',
            text: 'Rol-permiso creado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/role-permissions/list']);
          });
        },
        error: (error) => {
          let errorMessage = 'No se pudo crear el rol-permiso';
          if (error.error && error.error.error) {
            errorMessage = error.error.error;
          }
          Swal.fire('Error', errorMessage, 'error');
          this.loading = false;
        },
        complete: () => this.loading = false
      });
    } else if (this.mode === 3) {
      // Actualizar
      const id = this.form.get('id')?.value;
      this.rolePermissionService.update({ id, role_id, permission_id }).subscribe({
        next: () => {
          Swal.fire({
            title: 'Éxito',
            text: 'Rol-permiso actualizado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/role-permissions/list']);
          });
        },
        error: (error) => {
          let errorMessage = 'No se pudo actualizar el rol-permiso';
          if (error.error && error.error.error) {
            errorMessage = error.error.error;
          }
          Swal.fire('Error', errorMessage, 'error');
          this.loading = false;
        },
        complete: () => this.loading = false
      });
    }
  }

  back(): void {
    this.router.navigate(['/role-permissions/list']);
  }
}