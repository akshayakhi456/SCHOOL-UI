import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Observable, map } from "rxjs";
import { URLs } from "../../api-constants";
import { TokenService } from "../token/token.service";

@Injectable({
    providedIn: 'root'
  })
export class AuthenticationService {
    constructor(private http: HttpClient, private tokenService: TokenService) {}

    loginUser(payload: any): Observable<any> {
        return this.http.post(URLs.loginUser,payload).pipe(
            map((response: any) => {
              if (response) {
                this.tokenService.setToken(response.message);
              }
              return response;
            }));
    }

    registerUser(payload: any): Observable<any> {
        return this.http.post('',payload);
    }

    forgotPasswordUser(payload: any): Observable<any> {
        return this.http.post('',payload);
    }
}