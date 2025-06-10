// src/app/services/tracker.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrackerService {

  constructor() {}

  track(route: string): void {
    // Leer lo que ya hay en el localStorage
    const data = localStorage.getItem('routeCounts');
    const routeCounts = data ? JSON.parse(data) : {};

    // Aumentar el contador de la ruta
    if (routeCounts[route]) {
      routeCounts[route]++;
    } else {
      routeCounts[route] = 1;
    }

    // Guardar de nuevo en el localStorage
    localStorage.setItem('routeCounts', JSON.stringify(routeCounts));
  }

  getMostVisited(): string {
    const data = localStorage.getItem('routeCounts');
    const routeCounts = data ? JSON.parse(data) : {};

    let max = 0;
    let mostVisited = '';

    for (const key in routeCounts) {
      if (routeCounts[key] > max) {
        max = routeCounts[key];
        mostVisited = key;
      }
    }

    return mostVisited;
  }

  // (Opcional) Si quieres ver todas las rutas con sus visitas:
  getAllCounts(): { [key: string]: number } {
    const data = localStorage.getItem('routeCounts');
    return data ? JSON.parse(data) : {};
  }
}
