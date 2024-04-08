import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {

    return handler.handle(req).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          // Handle HTTP errors
          if (err.status === 401) {
            // Specific handling for unauthorized errors         
            console.error('Unauthorized request:', err);
            // You might trigger a re-authentication flow or redirect the user here
            // localStorage.removeItem('token')
            this.router.navigate(['/login']);
          } else {
            // Handle other HTTP error codes
            console.error('HTTP error:', err);
          }
        } else {
          // Handle non-HTTP errors
          console.error('An error occurred:', err);
        }
  
  
  
        // Re-throw the error to propagate it further
        return throwError(() => err); 
      })
    )
          
  }
}
