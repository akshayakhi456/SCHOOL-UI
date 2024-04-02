import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URLs } from '../../api-constants';

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
}
