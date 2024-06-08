import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URLs } from '../../api-constants';
import { IHttpResponse } from '../../models/auth.models';
import { IExamDetails } from '../../models/exam.models';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  constructor(private http: HttpClient) { }

  addExamsDetails(body: Array<IExamDetails>): Observable<IHttpResponse<string>> {
    return this.http.post<IHttpResponse<string>>(`${URLs.addExamsDetails}`, body);
  }

  updateExamsDetails(body: Array<IExamDetails>): Observable<IHttpResponse<string>> {
    return this.http.put<IHttpResponse<string>>(`${URLs.updateExamsDetails}`, body);
  }

  getExamsDetails(academicYearId: number, classId: number, examId: number): Observable<IHttpResponse<Array<IExamDetails>>> {
    const params = new HttpParams()
      .set('academicYearId', academicYearId)
      .set('classId', classId)
      .set('examId', examId);
    return this.http.get<IHttpResponse<Array<IExamDetails>>>(`${URLs.getExamsDetails}`, {
      params: params
    });
  }
}