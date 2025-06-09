import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Permission } from '../../models/permission/permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private baseUrl = `${environment.url_ms_security}/permissions`;

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }

  list(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.baseUrl)
      .pipe(catchError(this.handleError));
  }

  view(id: number): Observable<Permission> {
    return this.http.get<Permission>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(permission: Permission): Observable<Permission> {
    console.log('Sending create request to:', this.baseUrl);
    console.log('With data:', permission);
    return this.http.post<Permission>(this.baseUrl, permission)
      .pipe(catchError(this.handleError));
  }

  update(permission: Permission): Observable<Permission> {
    return this.http.put<Permission>(`${this.baseUrl}/${permission.id}`, permission)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getGroupedPermissions(roleId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/grouped/role/${roleId}`)
      .pipe(catchError(this.handleError));
  }
} 