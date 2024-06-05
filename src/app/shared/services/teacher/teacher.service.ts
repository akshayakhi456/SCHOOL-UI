import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { URLs } from "../../api-constants";
import { IHttpResponse } from "../../models/auth.models";
import { Observable } from "rxjs";
import { IAddTeacherRequest, ITeacherDetails } from "../../models/teacher.models";

@Injectable({
    providedIn: 'root'
  })
  export class TeacherService {
  
    constructor(private http: HttpClient) { }

    getTeachers(): Observable<IHttpResponse<Array<ITeacherDetails>>> {
        return this.http.get<IHttpResponse<Array<ITeacherDetails>>>(`${URLs.teacher}`)
    }

    addTeacher(body: IAddTeacherRequest): Observable<IHttpResponse<string>> {
        return this.http.post<IHttpResponse<string>>(`${URLs.addTeacher}`, body)
    }

    updateTeacher(body: IAddTeacherRequest): Observable<IHttpResponse<string>> {
        return this.http.post<IHttpResponse<string>>(`${URLs.updateTeacher}`, body)
    }

    deleteTeacher(id: number): Observable<IHttpResponse<string>> {
        return this.http.delete<IHttpResponse<string>>(`${URLs.deleteTeacher}/${id}`)
    }

    getTeacherById(id: number): Observable<IHttpResponse<IAddTeacherRequest>> {
        return this.http.get<IHttpResponse<IAddTeacherRequest>>(`${URLs.teacherById}/${id}`)
    }
    
  }