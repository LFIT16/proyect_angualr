import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RolePermission } from '../../models/RolePermission/role-permission.model';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {
  private baseUrl = `${environment.url_ms_security}/role-permissions`;

  constructor(private http: HttpClient) { }

  list(): Observable<RolePermission[]> {
    return this.http.get<RolePermission[]>(this.baseUrl);
  }

  view(id: string): Observable<RolePermission> {
    return this.http.get<RolePermission>(`${this.baseUrl}/view/${id}`);
  }

  create(rolePermission: RolePermission): Observable<RolePermission> {
    return this.http.post<RolePermission>(
      `${this.baseUrl}/roles/${rolePermission.role_id}/permissions/${rolePermission.permission_id}`,
      rolePermission
    );
  }

  update(rolePermission: RolePermission): Observable<RolePermission> {
    return this.http.put<RolePermission>(`${this.baseUrl}/roles/${rolePermission.role_id}/permissions/${rolePermission.permission_id}`, rolePermission);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}