import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RolePermissionService } from '../../../services/RolePermission/role-permission.service';
import { RoleService } from '../../../services/Role/role.service';
import { PermissionService } from '../../../services/permission/permission.service';
import { Role } from '../../../models/Roles/role.model';
import { Permission } from '../../../models/permission/permission.model';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number = 1; // 1=view, 2=create, 3=update
  theFormGroup: FormGroup;
  trySend: boolean = false;
  roles: Role[] = [];
  permissions: Permission[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private theFormBuilder: FormBuilder,
    private rolePermissionService: RolePermissionService,
    private roleService: RoleService,
    private permissionService: PermissionService
  ) {
    this.theFormGroup = this.theFormBuilder.group({
      id: [''],
      role_id: ['', [Validators.required]],
      permission_id: ['', [Validators.required]],
      created_at: [''],
      updated_at: ['']
    });
  }

  ngOnInit(): void {
    this.loading = true;
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    Promise.all([
      this.loadRoles(),
      this.loadPermissions()
    ]).then(() => {
      if (this.mode !== 2 && this.activateRoute.snapshot.params.id) {
        const id = this.activateRoute.snapshot.params.id;
        this.loadRolePermission(id);
      } else {
        this.loading = false;
      }
    }).catch(error => {
      console.error('Error loading initial data:', error);
      this.error = 'Error al cargar los datos iniciales';
      this.loading = false;
    });
  }

  private async loadRoles(): Promise<void> {
    try {
      const data = await this.roleService.list().toPromise();
      this.roles = data || [];
    } catch (error) {
      console.error('Error loading roles:', error);
      this.error = 'Error al cargar los roles';
      throw error;
    }
  }

  private async loadPermissions(): Promise<void> {
    try {
      const data = await this.permissionService.list().toPromise();
      this.permissions = data ? [...new Map(data.map(item => [item.id, item])).values()] : [];
    } catch (error) {
      console.error('Error loading permissions:', error);
      this.error = 'Error al cargar los permisos';
      throw error;
    }
  }

  private loadRolePermission(id: string): void {
    this.loading = true;
    this.rolePermissionService.view(id).subscribe({
      next: (data) => {
        if (data) {
          this.theFormGroup.patchValue({
            id: data.id,
            role_id: data.role_id,
            permission_id: data.permission_id,
            created_at: data.created_at,
            updated_at: data.updated_at
          });
          if (this.mode === 1) {
            this.theFormGroup.disable();
          }
        } else {
          this.error = 'No se encontró el permiso de rol';
        }
      },
      error: (error) => {
        console.error('Error loading role permission:', error);
        this.error = 'Error al cargar el permiso de rol';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  create() {
    if (this.theFormGroup.invalid) {
      this.trySend = true;
      return;
    }

    this.loading = true;

    // Solo enviar role_id y permission_id al backend
    const payload = {
      role_id: this.theFormGroup.value.role_id,
      permission_id: this.theFormGroup.value.permission_id
    };

    this.rolePermissionService.create(payload).subscribe({
      next: () => {
        this.router.navigate(['/role-permissions/list']);
      },
      error: (error) => {
        console.error('Error creating role permission:', error);
        this.error = 'Error al crear el permiso de rol';
        this.loading = false;
      }
    });
  }

  update() {
    if (this.theFormGroup.invalid) {
      this.trySend = true;
      return;
    }

    this.loading = true;
    // Puedes enviar todos los campos, el backend decidirá qué actualizar
    this.rolePermissionService.update(this.theFormGroup.value).subscribe({
      next: () => {
        this.router.navigate(['/role-permissions/list']);
      },
      error: (error) => {
        console.error('Error updating role permission:', error);
        this.error = 'Error al actualizar el permiso de rol';
        this.loading = false;
      }
    });
  }

  back() {
    this.router.navigate(['/role-permissions/list']);
  }
}