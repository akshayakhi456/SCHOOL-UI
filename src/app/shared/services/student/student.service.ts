import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URLs } from '../../api-constants';
import { IStudentApplyLeave, IStudentGuardianResponse } from '../../models/student.models';
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

  leaveApply(payload: IStudentApplyLeave): Observable<IHttpResponse<string>> {
    return this.http.post<IHttpResponse<string>>(`${URLs.postLeaveApply}`,payload)
  }

  leaveApprove(id: number): Observable<IHttpResponse<string>> {
    return this.http.get<IHttpResponse<string>>(`${URLs.leaveApproval}${id}`)
  }

  getStudentLeave(academicYearId: number, id: number): Observable<IHttpResponse<IStudentApplyLeave>> {
    const params = new HttpParams()
      .set('academicYearId', academicYearId)
      .set('id', id);
    return this.http.get<IHttpResponse<IStudentApplyLeave>>(`${URLs.getStudentLeave}`,{
      params:params
    })
  }

  getStudentLeaveForTeacher(academicYearId: number, classId: number, sectionId: number): Observable<IHttpResponse<IStudentApplyLeave>> {
    const params = new HttpParams()
    .set('academicYearId', academicYearId)
    .set('classId', classId)
    .set('sectionId', sectionId);
    return this.http.get<IHttpResponse<IStudentApplyLeave>>(`${URLs.getStudentLeaveForTeacher}`,{
      params:params
    })
  }
}
