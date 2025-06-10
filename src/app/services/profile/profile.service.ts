import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private baseUrl = `${environment.url_ms_security}/profiles`;

  constructor(private http: HttpClient) { }

  // Obtener todos los perfiles
  getAll(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/`);
  }

  // Obtener perfil por ID
  getById(profileId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${profileId}`);
  }

  // Obtener perfil por user_id
  getByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/${userId}`);
  }
  view(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Crear perfil (con imagen)
  create(userId: number, data: any, photo: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('phone', data.phone);
    if (photo) {
      formData.append('photo', photo);
    }
    return this.http.post(`${this.baseUrl}/user/${userId}`, formData);
  }

  // Actualizar perfil (con imagen)
  update(profileId: number, data: any, photo: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('phone', data.phone);
    if (photo) {
      formData.append('photo', photo);
    }
    return this.http.put(`${this.baseUrl}/${profileId}`, formData);
  }

  // Eliminar perfil
  delete(profileId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${profileId}`);
  }
}
