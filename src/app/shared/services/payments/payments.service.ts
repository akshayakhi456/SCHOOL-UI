import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URLs } from '../../api-constants';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private http: HttpClient) { }

  create(body: any): Observable<boolean> {
    return this.http.post<boolean>(`${URLs.createPayments}`, body);
  }


  getReceiptById(id: number): Observable<any> {
    return this.http.get(`${URLs.getPaymentsById}${id}`);
  }
}