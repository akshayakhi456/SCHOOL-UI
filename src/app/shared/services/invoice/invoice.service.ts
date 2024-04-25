import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { URLs } from "../../api-constants";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class InvoiceService {
    constructor(private http: HttpClient) { }

    getInvoiceId(): Observable<any> {
        return this.http.get(URLs.invoiceId);
    }

    postInvoice(payload: any): Observable<any> {
        return this.http.post(URLs.invoice, payload);
    }
  }