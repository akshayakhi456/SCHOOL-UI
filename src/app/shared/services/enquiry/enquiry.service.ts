import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URLs } from '../../api-constants';

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
}