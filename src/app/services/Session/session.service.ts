import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Session } from '../../models/Sessions/session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private baseUrl = `${environment.url_ms_security}/sessions`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Session[]> {
    return this.http.get<Session[]>(this.baseUrl);
  }

  getById(sessionId: string): Observable<Session> {
    return this.http.get<Session>(`${this.baseUrl}/${sessionId}`);
  }

  getByUserId(userId: number): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.baseUrl}/user/${userId}`);
  }
  list(): Observable<Session[]> {
      return this.http.get<Session[]>(`${environment.url_ms_security}/sessions`);
    }
    view(id: string): Observable<Session> {
      return this.http.get<Session>(`${environment.url_ms_security}/sessions/${id}`);
    }

  create( userId: number, sessionData: Partial<Session>): Observable<Session> {
    const url = `${this.baseUrl}/user/${userId}`;
    
    const body = {
      token: sessionData.token,
      expiration: sessionData.expiration || this.calculateDefaultExpiration(),
      FACode: sessionData.FACode,
      state: sessionData.state || 'active'
    };

    return this.http.post<Session>(url, body);
  }

  // create(newSession: Session): Observable<Session> {
  //     delete newSession.id;
  //     // Construir la URL con los IDs de usuario y rol
  //     return this.http.post<Session>(
  //       `${environment.url_ms_security}/sessions/user/${newSession.user_id}`,
  //       newSession
  //     );
  //   }
  update(sessionId: string, data: Partial<Session>): Observable<Session> {
    return this.http.put<Session>(`${this.baseUrl}/${sessionId}`, data);
  }

  delete(sessionId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${sessionId}`);
  }

  loginWithGoogle(userId: number, token: string): Observable<Session> {
    return this.create(userId, {
      token,
      state: 'active',
      expiration: this.calculateDefaultExpiration()
    });
  }

  login(sessionData: any): Observable<Session> {
    const url = `${this.baseUrl}/sessions`;
    return this.http.post<Session>(url, {
      token: sessionData.token,
      expiration: this.formatDateForBackend(this.calculateDefaultExpiration()),
      state: 'active',
      FACode: null
    });
  }

  private calculateDefaultExpiration(): Date {
    try {
      const date = new Date();
      date.setHours(date.getHours() + 24);
      return date;
    } catch (error) {
      console.error('Error calculating expiration:', error);
      // Fallback to a simple date if something goes wrong
      return new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
  }

  private formatDateForBackend(date: Date): string {
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }
}
