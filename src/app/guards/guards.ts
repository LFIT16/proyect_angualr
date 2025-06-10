// src/app/guards/tracking.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class TrackingGuard implements CanActivate {

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const path = state.url.split('/')[1]; // obtiene el módulo principal, como 'users'
        const counts = JSON.parse(localStorage.getItem('visitCounts') || '{}');

        counts[path] = (counts[path] || 0) + 1;

        localStorage.setItem('visitCounts', JSON.stringify(counts));

        return true;
    }
}
