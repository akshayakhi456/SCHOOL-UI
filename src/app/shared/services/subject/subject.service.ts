import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { URLs } from "../../api-constants";
import { IHttpResponse } from "../../models/auth.models";
import { Observable } from "rxjs";
import { IAddMarks, IClassWiseSubject, IClassWiseSubjectSave, IProgressCardResponseModel, ISubjectRequestModel, ISubjectResponseModel } from "../../models/subject.models";

@Injectable({
    providedIn: 'root'
  })
  export class SubjectService {
  
    constructor(private http: HttpClient) { }

    addMarks(body: Array<IAddMarks>): Observable<IHttpResponse<string>> {
        return  this.http.post<IHttpResponse<string>>(`${URLs.addMarks}`, body);
    }

    getMarksByClass(classId:number, section: number, acedemicYearId: number,  exam: number, subject: number = 0): Observable<IHttpResponse<Array<IAddMarks>>> {
        const params = new HttpParams()
            .set('classId', classId)
            .set('sectionId', section)
            .set('acedemicYearId', acedemicYearId)
            .set('examId', exam)
            .set('subjectId', subject)
        return  this.http.get<IHttpResponse<Array<IAddMarks>>>(`${URLs.getMarksByClass}`, {
            params
        });
    }

    getClassWiseSubjects(classId: number, academicYearId: number): Observable<IHttpResponse<Array<IClassWiseSubject>>> {
        const params = new HttpParams()
            .set('classId', classId)
            .set('academicYearId', academicYearId);
        return this.http.get<IHttpResponse<Array<IClassWiseSubject>>>(`${URLs.classSubject}`, {
            params: params
        });
    }

    postClassWiseSubject(payload: IClassWiseSubjectSave): Observable<IHttpResponse<string>> {
        return this.http.post<IHttpResponse<string>>(`${URLs.classSubject}`, payload);
    }

    deleteClassWiseSubject(id: number): Observable<IHttpResponse<string>> {
        return this.http.delete<IHttpResponse<string>>(`${URLs.classSubject}/${id}`);
    }

    getSubjectTeacher(academicYearId: number, classId: number, section: number): Observable<IHttpResponse<Array<ISubjectResponseModel>>> {
        const params = new HttpParams()
            .set('classId', classId)
            .set('academicYearId', academicYearId)
            .set('section', section);
        return this.http.get<IHttpResponse<Array<ISubjectResponseModel>>>(`${URLs.subjectTeacher}`, {
            params: params
        });
    }

    saveTeacherSubject(payload: Array<ISubjectRequestModel>): Observable<IHttpResponse<string>> {
        return this.http.post<IHttpResponse<string>>(`${URLs.subjectTeacher}`, payload);
    }

    updateTeacherSubject(payload: Array<ISubjectRequestModel>): Observable<IHttpResponse<string>> {
        return this.http.put<IHttpResponse<string>>(`${URLs.subjectTeacher}`, payload);
    }

    getMarksOfStudents(academicYearId: number, classId: number, section: number, examId: number): Observable<IHttpResponse<Array<IProgressCardResponseModel>>> {
        const params = new HttpParams()
        .set('classId', classId)
        .set('acedemicYearId', academicYearId)
        .set('examId', examId)
        .set('sectionId', section);
        return this.http.get<IHttpResponse<Array<IProgressCardResponseModel>>>(`${URLs.getMarksOfStudent}`, {
            params: params
        });
    }
    
  }