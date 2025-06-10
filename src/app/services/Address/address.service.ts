import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Address } from '../../models/Addresses/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  constructor(private http: HttpClient) { }
  list(): Observable<Address[]> {
    return this.http.get<Address[]>(`${environment.url_ms_security}/addresses`);
  }
  view(id: number): Observable<Address> {
    return this.http.get<Address>(`${environment.url_ms_security}/addresses/${id}`);
  }
  create(newAddress: Address): Observable<Address> {
    delete newAddress.id;
    // Construir la URL con los IDs de usuario y rol
    return this.http.post<Address>(
      `${environment.url_ms_security}/addresses/user/${newAddress.user_id}`,
      newAddress
    );
  }
  update(theAddress: Address): Observable<Address> {
    return this.http.put<Address>(`${environment.url_ms_security}/addresses/${theAddress.id}`, theAddress);
  }

  delete(id: number) {
    return this.http.delete<Address>(`${environment.url_ms_security}/addresses/${id}`);
  }

}
