import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URLs } from '../../api-constants';
import { IHttpResponse } from '../../models/auth.models';
import { IStudentAssignSectionRequestModel, IStudentAssignSectionResponseModel, IStudentAttendanceMonthYearRequest, IStudentAttendanceRequest, IstudentAttendance, IstudentMapSection } from '../../models/class.models';

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

    studentAssignSection(payload: Array<IStudentAssignSectionRequestModel>): Observable<IHttpResponse<string>> {
      return this.http.post<IHttpResponse<string>>(`${URLs.StudentAssignSection}`, payload);
    }

    getStudentAssignSection(classsName: string, academicYearId: number): Observable<IHttpResponse<Array<IStudentAssignSectionResponseModel>>> {
      return this.http.get<IHttpResponse<Array<IStudentAssignSectionResponseModel>>>(`${URLs.StudentAssignSection}?className=${classsName}&academicYearId=${academicYearId}`);
    }

    getStudentAssignSectionYear(classsName: string, section: string, academicYear: number): Observable<IHttpResponse<Array<IStudentAssignSectionResponseModel>>> {
      const params = new HttpParams()
      .set('className', classsName)
      .set('sectionId', section)
      .set('academicYearId', academicYear)
      // .set('subjectId', subjectId)
      // .set('examId', examId)
      return this.http.get<IHttpResponse<Array<IStudentAssignSectionResponseModel>>>(`${URLs.StudentAssignSection}`, {
        params: params
      });
    }
}