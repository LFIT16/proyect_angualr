import { Routes } from '@angular/router';

import { SessionComponent } from '../../pages/session/session.component';
// import { RegisterComponent } from '../../pages/register/register.component';
// import { NoAuthenticatedGuard } from 'src/app/guards/no-authenticated.guard';

export const AuthLayoutRoutes: Routes = [
    { path: 'session',  component: SessionComponent },
    // { path: 'register',       component: RegisterComponent }
];
