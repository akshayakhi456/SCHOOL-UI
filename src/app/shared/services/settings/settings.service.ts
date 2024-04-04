import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URLs } from '../../api-constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient) { }

  getClasses(): Observable<any> {
    return this.http.get(URLs.getClassesSettings);
  }

  getClassById(id: number): Observable<any> {
    return this.http.get(`${URLs.getClassSettingsById}${id}/section`);
  }

  createClass(payload: any): Observable<any> {
    return this.http.post(`${URLs.createClassSettings}`, payload)
  }

  updateClass(payload: any): Observable<any> {
    return this.http.put(`${URLs.updateClassSettings}`, payload)
  }

  deleteClass(id: number): Observable<any> {
    return this.http.delete(`${URLs.deleteClassesSettings}${id}`)
  }

  getSections(): Observable<any> {
    return this.http.get(URLs.getSectionSettings);
  }

  getSectionByClassName(id: string): Observable<any> {
    return this.http.get(`${URLs.getSectionSettingsById}${id}/sections`);
  }

  createSection(payload: any): Observable<any> {
    return this.http.post(`${URLs.createSectionSettings}`, payload)
  }

  updateSection(payload: any): Observable<any> {
    return this.http.put(`${URLs.updateSectionSettings}`, payload)
  }

  deleteSection(id: number): Observable<any> {
    return this.http.delete(`${URLs.deleteSectionSettings}${id}`)
  }

  createQuestion(payload: any):Observable<any> {
    return this.http.post(`${URLs.enquiryQuestionsSettings}`, payload);
  }

  updateQuestion(payload: any):Observable<any> {
    return this.http.put(`${URLs.enquiryQuestionsSettings}`, payload);
  }

  getEnquiryQuestionsSettings(): Observable<any> {
    return this.http.get(`${URLs.getEnquiryQuestionsSettings}`);
  }

  createPaymentAllotment(payload: any):Observable<any> {
    return this.http.post(`${URLs.paymentAllotmentsSettings}`, payload);
  }

  updatePaymentAllotment(payload: any):Observable<any> {
    return this.http.put(`${URLs.paymentAllotmentsSettings}`, payload);
  }

  getPaymentAllotment(className: string): Observable<any> {
    return this.http.get(`${URLs.paymentAllotmentsSettings}/${className}`);
  }
}
