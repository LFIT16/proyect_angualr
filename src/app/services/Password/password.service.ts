import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Password } from '../../models/Passwords/password.model';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  constructor(private http: HttpClient) { }
  list(): Observable<Password[]> {
    return this.http.get<Password[]>(`${environment.url_ms_security}/passwords`);
  }
  view(id: number): Observable<Password> {
    return this.http.get<Password>(`${environment.url_ms_security}/passwords/${id}`);
  }
  create(newPassword: Password): Observable<Password> {
    delete newPassword.id;
    // Construir la URL con los IDs de usuario y rol
    return this.http.post<Password>(
      `${environment.url_ms_security}/passwords/user/${newPassword.user_id}`,
      newPassword
    );
  }
  update(thePassword: Password): Observable<Password> {
    return this.http.put<Password>(`${environment.url_ms_security}/passwords/${thePassword.id}`, thePassword);
  }

  delete(id: number) {
    return this.http.delete<Password>(`${environment.url_ms_security}/passwords/${id}`);
  }

}
