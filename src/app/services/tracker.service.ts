// src/app/services/tracker.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrackerService {
  private counters: { [key: string]: number } = {};

  constructor() {}

  track(route: string): void {
    if (!this.counters[route]) {
      this.counters[route] = 1;
    } else {
      this.counters[route]++;
    }
  }

  getMostVisited(): string {
    let max = 0;
    let mostVisited = '';

    for (const key in this.counters) {
      if (this.counters[key] > max) {
        max = this.counters[key];
        mostVisited = key;
      }
    }

    return mostVisited;
  }
}
