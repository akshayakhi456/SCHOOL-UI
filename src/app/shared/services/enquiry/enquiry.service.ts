import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URLs } from '../../api-constants';
import { IEnquiryFeedback } from '../../models/enquiry.models';
import { IHttpResponse } from '../../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {

  constructor(private http: HttpClient) { }

  create(body: any): Observable<boolean> {
    return this.http.post<boolean>(`${URLs.createEnquiry}`, body);
  }

  update(body: any): Observable<boolean> {
    return this.http.put<boolean>(`${URLs.updateEnquiry}`, body);
  }


  get(): Observable<any> {
    return this.http.get(`${URLs.getEnquiry}`);
  }

  getById(id: number): Observable<any>{
    return this.http.get(`${URLs.getEnquiryById}${id}`)
  }

  createPayment(body: any): Observable<boolean> {
    return this.http.post<boolean>(`${URLs.createEnquiryPayments}`, body);
  }

  changeStatusEnquiryStudent(id: number, status: boolean) {
    return this.http.post<boolean>(`${URLs.changeStatusEnquiryStudent}${id}`, status);
  }

  saveFeedBack(payload: IEnquiryFeedback): Observable<IHttpResponse<string>> {
    return this.http.post<IHttpResponse<string>>(`${URLs.saveFeedBack}`, payload);
  }

  getFeedBackList(id: number): Observable<IHttpResponse<Array<IEnquiryFeedback>>> {
    return this.http.get<IHttpResponse<Array<IEnquiryFeedback>>>(`${URLs.feedbackList}${id}`);
  }
}