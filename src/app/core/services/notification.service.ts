import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private requestCount = 0;
  readonly isLoading = signal(false);

  setLoading(loading: boolean): void {
    this.requestCount = loading
      ? this.requestCount + 1
      : Math.max(0, this.requestCount - 1);
    this.isLoading.set(this.requestCount > 0);
  }
}
