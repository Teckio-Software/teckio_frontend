// auth-event.service.ts
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthEventService {
  private loginSuccessSubject = new Subject<void>();

  // Observable que los componentes pueden suscribir
  loginSuccess$: Observable<void> = this.loginSuccessSubject.asObservable();

  constructor() {}

  // Método que el componente de inicio de sesión llamará
  notifyLoginSuccess(): void {
    this.loginSuccessSubject.next();
  }
}