import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface SessionForm {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {
  private auth2: any;
  session: SessionForm = {
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    @Inject('GOOGLE_CLIENT_ID') private googleClientId: string
  ) {}

  ngOnInit() {
    this.loadGoogleAuth();
  }

  login() {
    const sessionData = {
      id: this.generateId(),
      user_id: Math.floor(Math.random() * 1000) + 1,
      token: this.generateToken(),
      expiration: this.calculateExpiration(),
      state: 'active',
      FACode: null,
      email: this.session.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      provider: 'email'
    };

    localStorage.setItem('currentSession', JSON.stringify(sessionData));

    Swal.fire({
      title: 'Login exitoso',
      text: 'Bienvenido',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      willClose: () => {
        window.location.href = 'http://localhost:4200/#/users/list';
      }
    });
  }

  private loadGoogleAuth() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: this.googleClientId,
        callback: this.handleCredentialResponse.bind(this)
      });
      // @ts-ignore
      google.accounts.id.renderButton(
        document.getElementById('google-signin'),
        { theme: 'outline', size: 'large', width: 250 }
      );
    };
  }

  private handleCredentialResponse(response: any) {
    const token = response.credential;
    const payload = this.decodeJwtResponse(token);
    
    const sessionData = {
      id: this.generateId(),
      user_id: Math.floor(Math.random() * 1000) + 1,
      token: token,
      expiration: this.calculateExpiration(),
      state: 'active',
      FACode: null,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      provider: 'google'
    };

    localStorage.setItem('currentSession', JSON.stringify(sessionData));

    Swal.fire({
      title: 'Login exitoso',
      text: 'Bienvenido ' + payload.name,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      willClose: () => {
        window.location.href = 'http://localhost:4200/#/users/list';
      }
    });
  }

  private generateId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateToken(): string {
    const randomBytes = new Uint8Array(16);
    window.crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private calculateExpiration(): string {
    const date = new Date();
    date.setHours(date.getHours() + 24);
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }

  private decodeJwtResponse(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }
}