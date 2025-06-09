import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Digitalsignature } from '../../models/DigitalSgnature/digitalsignature.model';

@Injectable({
  providedIn: 'root'
})
export class DigitalSignatureService {
  private baseUrl = `${environment.url_ms_security}/digital-signatures`;

  constructor(private http: HttpClient) {}

  list(): Observable<Digitalsignature[]> {
    return this.http.get<Digitalsignature[]>(`${this.baseUrl}`);
  }

  view(id: number): Observable<Digitalsignature> {
    return this.http.get<Digitalsignature>(`${this.baseUrl}/${id}`);
  }

  create(formData: FormData): Observable<Digitalsignature> {
    const user_id = formData.get('user_id');
    // The user_id should be cast to string since FormData.get() returns string | null
    return this.http.post<Digitalsignature>(
      `${this.baseUrl}/user/${user_id}`, 
      formData,
      {
        headers: {
          // Remove Content-Type header to let browser set it with boundary for FormData
          'Accept': 'application/json'
        }
      }
    );
  }

  update(id: number, formData: FormData): Observable<Digitalsignature> {
    return this.http.put<Digitalsignature>(
      `${this.baseUrl}/${id}`, 
      formData,
      {
        headers: {
          // Remove Content-Type header to let browser set it with boundary for FormData
          'Accept': 'application/json'
        }
      }
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
