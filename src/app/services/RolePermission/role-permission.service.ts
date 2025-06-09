import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RolePermission } from '../../models/RolePermission/role-permission.model';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {
  private baseUrl = `${environment.url_ms_security}/api/role-permissions`; // Added /api/

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
  create(data: { role_id: number; permission_id: number }): Observable<RolePermission> {
    return this.http.post<RolePermission>(this.baseUrl, {
      role_id: data.role_id,
      permission_id: data.permission_id
    });
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