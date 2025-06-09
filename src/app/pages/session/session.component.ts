import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../../models/Sessions/session.model';
import { SessionService } from '../../services/Session/session.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit, OnDestroy {
  session: { email: string; password: string } = { email: "", password: "" };

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {}

  login() {
    this.sessionService.login(this.session).subscribe({
      next: (data) => {
        this.sessionService.saveSession(data);
        this.router.navigate(["users/list"]);
      },
      error: () => {
        Swal.fire("Autenticación Inválida", "Usuario o contraseña inválido", "error");
      }
    });
  }

  ngOnInit() {}
  ngOnDestroy() {}
}