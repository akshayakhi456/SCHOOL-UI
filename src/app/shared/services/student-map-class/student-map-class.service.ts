import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URLs } from '../../api-constants';
import { IHttpResponse } from '../../models/auth.models';
import { IStudentAttendanceMonthYearRequest, IStudentAttendanceRequest, IstudentAttendance, IstudentMapSection } from '../../models/class.models';

@Injectable({
  providedIn: 'root'
})
export class StudentMapClassService {
    constructor(private http: HttpClient) {}

    studentAttendance(payload: Array<IstudentAttendance>): Observable<IHttpResponse<string>> {
        return this.http.post<IHttpResponse<string>>(`${URLs.studentAttendance}`, payload);
    }

    updateStudentAttendance(payload: Array<IStudentAttendanceRequest>): Observable<IHttpResponse<string>> {
      return this.http.post<IHttpResponse<string>>(`${URLs.updateStudentAttendance}`, payload);
  }

  getStudentAttendance(payload: IStudentAttendanceRequest): Observable<IHttpResponse<Array<IstudentAttendance>>>{
    return this.http.post<IHttpResponse<Array<IstudentAttendance>>>(`${URLs.GetStudentAttendance}`, payload);
  }

    getStudentAttendanceByMonthYear(payload: IStudentAttendanceMonthYearRequest): Observable<IHttpResponse<Array<IstudentAttendance>>>{
      return this.http.post<IHttpResponse<Array<IstudentAttendance>>>(`${URLs.GetStudentAttendanceByMonthYear}`, payload);
    }

    studentAssignSection(payload: Array<IstudentMapSection>): Observable<IHttpResponse<string>> {
      return this.http.post<IHttpResponse<string>>(`${URLs.StudentAssignSection}`, payload);
    }

    getStudentAssignSection(classsName: string, academicYearId: number): Observable<IHttpResponse<Array<IstudentMapSection>>> {
      return this.http.get<IHttpResponse<Array<IstudentMapSection>>>(`${URLs.StudentAssignSection}?className=${classsName}&academicYearId=${academicYearId}`);
    }

    getStudentAssignSectionYear(classsName: string, section: string, academicYear: number): Observable<IHttpResponse<Array<IstudentMapSection>>> {
      const params = new HttpParams()
      .set('className', classsName)
      .set('section', section)
      .set('academicYearId', academicYear)
      // .set('subjectId', subjectId)
      // .set('examId', examId)
      return this.http.get<IHttpResponse<Array<IstudentMapSection>>>(`${URLs.StudentAssignSection}`, {
        params: params
      });
    }
}