import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RolePermissionService } from '../../../services/RolePermission/role-permission.service';
import { RolePermission } from '../../../models/RolePermission/role-permission.model';
import { Role } from '../../../models/Roles/role.model';
import { Permission } from '../../../models/permission/permission.model';
import { RoleService } from '../../../services/Role/role.service';
import { PermissionService } from '../../../services/permission/permission.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  rolePermissions: RolePermission[] = [];
  role: Role[] = [];
  permission: Permission[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(
    private router: Router,
    private rolePermissionService: RolePermissionService,
    private roleService: RoleService,
    private permissionService: PermissionService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    Promise.all([
      this.loadpermissions(),
      this.loadRoles(),
      this.list()
    ]).catch(error => {
      console.error('Error loading data:', error);
      this.error = 'Error al cargar los datos';
    }).finally(() => {
      this.loading = false;
    });
  }

  private async loadpermissions(): Promise<void> {
    try {
      const permissions = await this.permissionService.list().toPromise();
      this.permission = permissions || [];
    } catch (error) {
      console.error('Error loading permissions:', error);
      this.error = 'Error al cargar los permisos';
      throw error;
    }
  }

  private async loadRoles(): Promise<void> {
    try {
      const roles = await this.roleService.list().toPromise();
      this.role = roles || [];
    } catch (error) {
      console.error('Error loading roles:', error);
      this.error = 'Error al cargar los roles';
      throw error;
    }
  }

  private async list(): Promise<void> {
    try {
      const permissionsRoles = await this.rolePermissionService.list().toPromise();
      this.rolePermissions = permissionsRoles || [];
    } catch (error) {
      console.error('Error loading role permissions:', error);
      this.error = 'Error al cargar los permisos de roles';
      throw error;
    }
  }

  create() {
    this.router.navigate(['/role-permissions/create']);
  }

  view(id: string) {
    this.router.navigate(['/role-permissions/view', id]);
  }

  edit(id: string) {
    this.router.navigate(['/role-permissions/update', id]);
  }

  delete(id: string) {
    if (confirm('¿Está seguro de eliminar este permiso de rol?')) {
      this.loading = true;
      this.rolePermissionService.delete(id).subscribe({
        next: () => {
          this.list();
        },
        error: (error) => {
          console.error('Error deleting role permission:', error);
          this.error = 'Error al eliminar el permiso de rol';
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  getRoleName(roleId: number): string {
    const role = this.role.find(r => r.id === roleId);
    return role ? role.name : '';
  }

  getPermissionName(permissionId: number): string {
    const permission = this.permission.find(p => p.id === permissionId);
    return permission ? permission.method : '';
  }
} 