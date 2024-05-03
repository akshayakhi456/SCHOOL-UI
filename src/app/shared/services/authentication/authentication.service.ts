import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Observable, map } from "rxjs";
import { URLs } from "../../api-constants";
import { TokenService } from "../token/token.service";
import { IChangePasswordRequest, IChangePasswordResponse, IHttpResponse, IRegisterRequest } from "../../models/auth.models";

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

    updateUser(payload: IRegisterRequest): Observable<IHttpResponse<string>> {
      return this.http.post<IHttpResponse<string>>(URLs.updateUser,payload);
    }

    forgotPasswordUser(payload: any): Observable<any> {
        return this.http.post('',payload);
    }

    getRoles(): Observable<Array<string>> {
      return this.http.get<Array<string>>(URLs.roles);
    }

    getUserDetails(): Observable<IHttpResponse<Array<IRegisterRequest>>> {
      return this.http.get<IHttpResponse<Array<IRegisterRequest>>>(URLs.registerUserDetail);    
    }

    changePasswordUser(payload: IChangePasswordRequest): Observable<IHttpResponse<IChangePasswordResponse>> {
      return this.http.post<IHttpResponse<IChangePasswordResponse>>(URLs.changePassword,payload);
    }

    resetPassword(username: string): Observable<IHttpResponse<string>> {
      return this.http.get<IHttpResponse<string>>(`${URLs.resetPassword}/${username}`);  
    }

    resetPasswordWithToken(token:string, username: string, password: string): Observable<IHttpResponse<string>> {
      const headers = new HttpHeaders().set('token', token);
      const params = {
        token,
        username,
        password
      }
      return this.http.get<IHttpResponse<string>>(URLs.resetPassword, {
        headers: headers,
        params: params
      });  
    }

    me(): Observable<IHttpResponse<IRegisterRequest>> {
      return this.http.get<IHttpResponse<IRegisterRequest>>(URLs.me);
    }

  isAuthenticated(): boolean {
    const user = this.decodeToken();
    if(!user) {
      return false;
    }
    if (user.exp * 1000 < Date.now()) {
      return true;
    }
    return false;
  }

  userName(): string {
    const user = this.decodeToken();
    if(!user) {
      return '';
    }
    return user.FirstName +' '+ user.LastName;
  }

  role(): string {
    const user = this.decodeToken();
    if(!user) {
      return '';
    }
    const role = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    return user[role];
  }

  displayName(): string {
    const name = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
    const user = this.decodeToken();
    if(!user) {
      return '';
    }
    return user[name];
  }

  decodeToken() {
    const token = this.tokenService.getToken();
    if (!token) {
      return null;
    }

    const user = atob(token!.split('.')[1]);
    return JSON.parse(user);
  }
}