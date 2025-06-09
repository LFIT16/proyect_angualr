import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RolePermission } from '../../models/RolePermission/role-permission.model';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {
  private baseUrl = `${environment.url_ms_security}/role-permissions`; // <-- Solo un /api

  constructor(private http: HttpClient) { }

  // Get all role-permissions
  list(): Observable<RolePermission[]> {
    return this.http.get<RolePermission[]>(this.baseUrl);
  }

  // Get role-permission by ID
  view(id: string): Observable<RolePermission> {
    return this.http.get<RolePermission>(`${this.baseUrl}/${id}`);
  }

  // Create new role-permission
  create(newRolePermission: RolePermission): Observable<RolePermission> {
    delete newRolePermission.id;
    return this.http.post<RolePermission>(
      `${this.baseUrl}/role/${newRolePermission.role_id}/permission/${newRolePermission.permission_id}`,
      newRolePermission
    );
  }

  // Update role-permission
  update(data: { id: string; role_id: number; permission_id: number }): Observable<RolePermission> {
    return this.http.put<RolePermission>(`${this.baseUrl}/${data.id}`, {
      role_id: data.role_id,
      permission_id: data.permission_id
    });
  }

  // Delete role-permission
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}