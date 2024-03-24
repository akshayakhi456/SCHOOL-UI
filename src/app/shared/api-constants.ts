import { environment } from "../../environments/environment.development";

export const URLs = {
    createStudent : `${environment.apiUrl}student/create`,
    getStudents: `${environment.apiUrl}student`,

    createEnquiry: `${environment.apiUrl}enquiry/create`,
    getEnquiry: `${environment.apiUrl}enquiry`,

    createExpenses: `${environment.apiUrl}expenses/create`,
    getExpenses: `${environment.apiUrl}expenses`,

    createPayments: `${environment.apiUrl}payments/create`,
    getPaymentsById: `${environment.apiUrl}payments/`,
}