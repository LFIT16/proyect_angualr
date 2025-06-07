import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Device } from '../../models/Device/device.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  constructor(private http: HttpClient) {}
  list(): Observable<Device[]> {
    return this.http.get<Device[]>(`${environment.url_ms_security}/devices`);
   }
  view(id: number): Observable<Device> {
    return this.http.get<Device>(`${environment.url_ms_security}/devices/${id}`);
   }
  create(newDevice: Device): Observable<Device> {
    delete newDevice.id;
    return this.http.post<Device>(`${environment.url_ms_security}/devices/user`, newDevice);
  }
  update(theDevice: Device): Observable<Device> {
    return this.http.put<Device>(`${environment.url_ms_security}/devices/${theDevice.id}`, theDevice);
  } 

  delete(id: number) {
    return this.http.delete<Device>(`${environment.url_ms_security}/devices/${id}`);
   }
}
