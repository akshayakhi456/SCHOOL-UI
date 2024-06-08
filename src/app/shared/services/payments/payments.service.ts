import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URLs } from '../../api-constants';
import { IPaymentTransaction } from '../../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private http: HttpClient) { }

  create(body: IPaymentTransaction): Observable<boolean> {
    return this.http.post<boolean>(`${URLs.createPayments}`, body);
  }

  getReceiptById(id: number): Observable<any> {
    return this.http.get(`${URLs.getPaymentsById}${id}`);
  }

  getclassWiseReport(yearID: number): Observable<any> {
    return this.http.get(`${URLs.getclassWiseReport}/${yearID}`);
  }

  getyearWiseReport(yearID: number): Observable<any> {
    return this.http.get(`${URLs.getyearWiseReport}/${yearID}`);
  }

  postRecordsOfPayment(payload: any): Observable<any> {
    return this.http.post(`${URLs.postRecordsOfPayment}`, payload)
  }
}