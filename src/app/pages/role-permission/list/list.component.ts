import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RolePermissionService } from '../../../services/RolePermission/role-permission.service';
import { RoleService } from '../../../services/Role/role.service';
import { PermissionService } from '../../../services/permission/permission.service';
import { RolePermission } from '../../../models/RolePermission/role-permission.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  rolePermissions: RolePermission[] = [];
  roles: any[] = [];
  permissions: any[] = [];
  loading: boolean = false;

  constructor(
    private rolePermissionService: RolePermissionService,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadRolePermissions();
    this.loadRoles();
    this.loadPermissions();
  }

  loadRolePermissions(): void {
    this.loading = true;
    this.rolePermissionService.list().subscribe({
      next: (data: RolePermission[]) => {
        this.rolePermissions = data;
        this.loading = false;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
        this.loading = false;
      }
    });
  }

  loadRoles(): void {
    this.roleService.list().subscribe({
      next: (data) => this.roles = data,
      error: () => console.error('Error loading roles')
    });
  }

  loadPermissions(): void {
    this.permissionService.list().subscribe({
      next: (data) => this.permissions = data,
      error: () => console.error('Error loading permissions')
    });
  }

  delete(rolePermission: RolePermission): void {
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
        this.rolePermissionService.delete(rolePermission.id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El registro ha sido eliminado', 'success');
            this.loadRolePermissions();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el registro', 'error')
        });
      }
    });
  }

  getRoleName(roleId: number): string {
    const role = this.roles.find(r => r.id === roleId);
    return role ? role.name : 'N/A';
  }

  getPermissionName(permissionId: number): string {
    const permission = this.permissions.find(p => p.id === permissionId);
    return permission ? `${permission.method} - ${permission.entity || permission.url}` : 'N/A';
  }

  create(): void {
    this.router.navigate(['/role-permissions/create']);
  }

  view(id: string): void {
    this.router.navigate(['/role-permissions/view', id]);
  }

  edit(id: string): void {
    this.router.navigate(['/role-permissions/edit', id]);
  }
}