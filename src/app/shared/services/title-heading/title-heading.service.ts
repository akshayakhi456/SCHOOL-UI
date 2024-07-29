import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URLs } from '../../api-constants';
import { IHttpResponse } from '../../models/auth.models';
import { ITitileHeader } from '../../models/titleHeader.models';

@Injectable({
  providedIn: 'root'
})
export class TitleHeadingService {

  constructor(private http: HttpClient) { }

  getTitleHeader(): Observable<IHttpResponse<Array<ITitileHeader>>> {
    return this.http.get<IHttpResponse<Array<ITitileHeader>>>(`${URLs.listTitleHeader}`)
  }

  getByQueryTitleHeader(query: string): Observable<IHttpResponse<ITitileHeader>> {
    const params = new HttpParams()
      .set('query', query);
    return this.http.get<IHttpResponse<ITitileHeader>>(`${URLs.listByQueryTitleHeader}`,{
      params: params 
    })
  }

  saveTitleHeader(body: FormData): Observable<IHttpResponse<string>> {
      return this.http.post<IHttpResponse<string>>(`${URLs.saveTitleHeader}`, body)
  }

}
