import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { URLs } from "../../api-constants";
import { IHttpResponse } from "../../models/auth.models";
import { Observable } from "rxjs";
import { IAddMarks } from "../../models/subject.models";

@Injectable({
    providedIn: 'root'
  })
  export class SubjectService {
  
    constructor(private http: HttpClient) { }

    addMarks(body: Array<IAddMarks>): Observable<IHttpResponse<string>> {
        return  this.http.post<IHttpResponse<string>>(`${URLs.addMarks}`, body);
    }

    getMarksByClass(className:string, section: string, acedemicYearId: number, subject: string): Observable<IHttpResponse<Array<IAddMarks>>> {
        const params = new HttpParams()
            .set('className', className)
            .set('section', section)
            .set('acedemicYearId', acedemicYearId)
            .set('subject', subject);
        return  this.http.get<IHttpResponse<Array<IAddMarks>>>(`${URLs.getMarksByClass}`, {
            params
        });
    }
  }