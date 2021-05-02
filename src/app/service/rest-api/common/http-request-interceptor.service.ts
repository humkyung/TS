import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HttpRequestInterceptorService implements HttpInterceptor{
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var token = localStorage.getItem('x-auth-token');
    if (token){
      var reqHeader: HttpHeaders = req.headers;
      reqHeader = reqHeader.set('x-auth-token', token);
      const newRequest = req.clone({headers: reqHeader});

      // req = req.clone({ 
      //   setHeaders: { 
      //     'x-auth-token': token
      //   }
      // })

      return next.handle(newRequest);
      // reqHeader = reqHeader.set('x-auth-token', token);
      // const newRequest = req.clone({headers: reqHeader});
    }
    return next.handle(req);
  }

  constructor() { }
}
