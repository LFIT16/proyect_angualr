import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Securityquestion } from '../../models/SecurityQuestion/securityquestion.model';

@Injectable({
  providedIn: 'root'
})
export class SecurityquestionService {
    constructor(private http: HttpClient) {}
      list(): Observable<Securityquestion[]> {
        return this.http.get<Securityquestion[]>(`${environment.url_ms_security}/security-questions`);
       }
      view(id: number): Observable<Securityquestion> {
        return this.http.get<Securityquestion>(`${environment.url_ms_security}/security-questions/${id}`);
       }
      create(newDevice: Securityquestion): Observable<Securityquestion> {
        delete newDevice.id;
        return this.http.post<Securityquestion>(`${environment.url_ms_security}/security-questions`, newDevice);
      }
      update(theDevice: Securityquestion): Observable<Securityquestion> {
        return this.http.put<Securityquestion>(`${environment.url_ms_security}/security-questions/${theDevice.id}`, theDevice);
      } 
    
      delete(id: number) {
        return this.http.delete<Securityquestion>(`${environment.url_ms_security}/security-questions/${id}`);
       }
}
