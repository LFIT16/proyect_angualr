import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Session } from '../../models/Sessions/session.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  theSession = new BehaviorSubject<Session>(new Session());
  constructor(private http: HttpClient) { 
    this.verifyActualSession();
  }

  /**
  * Realiza la petición al backend con el correo y la contraseña
  * para verificar si existe o no en la plataforma
  * @param infoUsuario JSON con la información de correo y contraseña
  * @returns Respuesta HTTP la cual indica si el usuario tiene permiso de acceso
  */
  login(sessionData: any): Observable<any> {
    return this.http.post<any>(`${environment.url_ms_security}/sessions`, sessionData);
  }

  /*
  Guardar la información de usuario en el local storage
  */
  saveSession(dataSesion: any) {
    let data: Session = {
      id: dataSesion["Session"]["id"],
      user_id: dataSesion["Session"]["user_id"],
      token: dataSesion["token"],
      expiration: dataSesion["Session"]["expiration"],
      FACode: dataSesion["Session"]["FACode"],
      state: dataSesion["Session"]["state"],
      created_at: dataSesion["Session"]["created_at"],
      updated_at: dataSesion["Session"]["updated_at"],
    };
    localStorage.setItem('sesion', JSON.stringify(data));
    this.setSession(data);
  }

  /**
    * Permite actualizar la información del usuario
    * que acabó de validarse correctamente
    * @param session información del usuario logueado
  */
  setSession(session: Session) {
    this.theSession.next(session);
  }

  /**
  * Permite obtener la información del usuario
  * con datos tales como el identificador y el token
  * @returns
  */
  getSession() {
    return this.theSession.asObservable();
  }

  /**
    * Permite obtener la información de usuario
    * que tiene la función activa y servirá
    * para acceder a la información del token
  */
  public get activeSession(): Session {
    return this.theSession.value;
  }

  /**
  * Permite cerrar la sesión del usuario
  * que estaba previamente logueado
  */
  logout() {
    localStorage.removeItem('sesion');
    this.setSession(new Session());
  }

  /**
  * Permite verificar si actualmente en el local storage
  * existe información de un usuario previamente logueado
  */
  verifyActualSession() {
    let actualSesion = this.getSessionData();
    if (actualSesion) {
      this.setSession(JSON.parse(actualSesion));
    }
  }

  /**
  * Verifica si hay una sesion activa
  * @returns
  */
  existSession(): boolean {
    let sesionActual = this.getSessionData();
    return (sesionActual) ? true : false;
  }

  /**
  * Permite obtener los dato de la sesión activa en el
  * local storage
  * @returns
  */
  getSessionData() {
    let sesionActual = localStorage.getItem('sesion');
    return sesionActual;
  }
}