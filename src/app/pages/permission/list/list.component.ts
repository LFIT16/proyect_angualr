import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionService } from '../../../services/permission/permission.service';
import { Permission } from '../../../models/permission/permission.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  permissions: Permission[] = [];

  constructor(
    private router: Router,
    private permissionService: PermissionService
  ) { }

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions() {
    this.permissionService.list().subscribe(
      (data) => {
        this.permissions = data;
      },
      (error) => {
        console.error('Error loading permissions:', error);
      }
    );
  }

  create() {
    this.router.navigate(['/permissions/create']);
  }

  view(id: number) {
    this.router.navigate(['/permissions/view/', id]);
  }

  edit(id: number) {
    this.router.navigate(['/permissions/update/', id]);
  }

  delete(id: number) {
    if (confirm('¿Está seguro de eliminar este permiso?')) {
      this.permissionService.delete(id).subscribe(
        () => {
          this.loadPermissions();
        },
        (error) => {
          console.error('Error deleting permission:', error);
        }
      );
    }
  }
} 