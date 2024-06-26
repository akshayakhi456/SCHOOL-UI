import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URLs } from '../../api-constants';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  constructor(private http: HttpClient) { }

  create(body: any): Observable<boolean> {
    return this.http.post<boolean>(`${URLs.createExpenses}`, body);
  }


  get(): Observable<any> {
    return this.http.get(`${URLs.getExpenses}`);
  }

  getExpensesGraph(): Observable<any> {
    return this.http.get(`${URLs.getExpensesGraph}`);
  }
}