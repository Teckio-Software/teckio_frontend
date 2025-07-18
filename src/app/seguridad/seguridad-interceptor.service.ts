import { Injectable } from '@angular/core';
import { SeguridadService } from './seguridad.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeguridadInterceptorService implements HttpInterceptor {
  //
  constructor(private zvSeguridadService: SeguridadService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const zvToken = this.zvSeguridadService.zfObtenerToken();
    if (zvToken) {
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${zvToken}`}
      });
    }
    return next.handle(request);
  }
}
