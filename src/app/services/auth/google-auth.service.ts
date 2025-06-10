import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private auth2: any;
  private loginSubject = new Subject<any>();

  constructor() {
    this.loadGoogleAuth();
  }

  private loadGoogleAuth(): void {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: 'TU_GOOGLE_CLIENT_ID',
      callback: this.handleCredentialResponse.bind(this)
    });
  }

  initializeGoogleButton(buttonId: string): void {
    // @ts-ignore
    google.accounts.id.renderButton(
      document.getElementById(buttonId),
      { theme: 'outline', size: 'large' }
    );
  }

  private handleCredentialResponse(response: any): void {
    this.loginSubject.next(response);
  }

  getLoginObservable(): Observable<any> {
    return this.loginSubject.asObservable();
  }
}