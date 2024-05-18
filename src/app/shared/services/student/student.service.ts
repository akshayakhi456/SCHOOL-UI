import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URLs } from '../../api-constants';
import { IStudentGuardianResponse } from '../../models/student.models';
import { IHttpResponse } from '../../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  create(body: FormData): Observable<boolean> {
    return this.http.post<boolean>(`${URLs.createStudent}`, body);
  }

  update(body: FormData): Observable<boolean> {
    return this.http.put<boolean>(`${URLs.updateStudent}`, body);
  }

  get(): Observable<any> {
    return this.http.get(`${URLs.getStudents}`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${URLs.getStudentById}${id}`);
  }

  getByKey(key: string): Observable<any> {
    return this.http.get(`${URLs.studentByKey}?q=${key}`);
  }

  getStudentByClassName(className: string): Observable<any> {
    return this.http.get(`${URLs.getStudentByClassName}${className}`);
  }

  getStudentsByRoles(): Observable<IHttpResponse<Array<IStudentGuardianResponse>>> {
    return this.http.get<IHttpResponse<Array<IStudentGuardianResponse>>>(`${URLs.getStudentsByRoles}`);
  }
}
