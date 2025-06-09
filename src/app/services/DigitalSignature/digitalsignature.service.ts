import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Digitalsignature } from '../../models/DigitalSgnature/digitalsignature.model';

@Injectable({
  providedIn: 'root'
})
export class DigitalSignatureService {
  private baseUrl = `${environment.url_ms_security}/digital-signatures`;

  constructor(private http: HttpClient) {}

  create(formData: FormData): Observable<any> {
    const user_id = formData.get('user_id');
    const photo = formData.get('photo');
    
    // Create a new FormData with the exact structure expected by the backend
    const backendFormData = new FormData();
    if (photo instanceof File) {
      backendFormData.append('photo', photo, photo.name);
    }
    
    return this.http.post<any>(`${this.baseUrl}/user/${user_id}`, backendFormData);
  }

  update(id: number, formData: FormData): Observable<any> {
    const photo = formData.get('photo');
    
    // Create a new FormData with the exact structure expected by the backend
    const backendFormData = new FormData();
    if (photo instanceof File) {
      backendFormData.append('photo', photo, photo.name);
    }
    
    return this.http.put<any>(`${this.baseUrl}/${id}`, backendFormData);
  }

  get(id: number): Observable<Digitalsignature> {
    return this.http.get<Digitalsignature>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        // Append the backend URL to the photo path
        if (response.photo) {
          response.photo = `${environment.url_ms_security}/${response.photo}`;
        }
        return response;
      })
    );
  }

  list(): Observable<Digitalsignature[]> {
    return this.http.get<Digitalsignature[]>(this.baseUrl).pipe(
      map(signatures => {
        // Append the backend URL to each photo path
        return signatures.map(signature => {
          if (signature.photo) {
            signature.photo = `${environment.url_ms_security}/${signature.photo}`;
          }
          return signature;
        });
      })
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
