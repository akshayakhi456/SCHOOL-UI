import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Observable, map } from "rxjs";
import { URLs } from "../../api-constants";
import { TokenService } from "../token/token.service";
import { IChangePasswordRequest, IChangePasswordResponse, IRegisterRequest, IRegisterUsers } from "../../models/auth.models";

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

    registerUser(payload: IRegisterRequest): Observable<any> {
        return this.http.post(URLs.registerUser,payload);
    }

    forgotPasswordUser(payload: any): Observable<any> {
        return this.http.post('',payload);
    }

    getRoles(): Observable<Array<string>> {
      return this.http.get<Array<string>>(URLs.roles);
    }

    getUserDetails(): Observable<IRegisterUsers> {
      return this.http.get<IRegisterUsers>(URLs.registerUserDetail);    
    }

    changePasswordUser(payload: IChangePasswordRequest): Observable<IChangePasswordResponse> {
      return this.http.post<IChangePasswordResponse>(URLs.changePassword,payload);
  }
}