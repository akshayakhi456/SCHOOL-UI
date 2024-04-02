import { environment } from "../../environments/environment.development";

export const URLs = {
    createStudent : `${environment.apiUrl}student/create`,
    updateStudent : `${environment.apiUrl}student/update`,
    getStudents: `${environment.apiUrl}student`,
    getStudentById: `${environment.apiUrl}student/`,

    createEnquiry: `${environment.apiUrl}enquiry/create`,
    updateEnquiry: `${environment.apiUrl}enquiry/update`,
    getEnquiry: `${environment.apiUrl}enquiry`,
    getEnquiryById: `${environment.apiUrl}enquiry/`,
    createEnquiryPayments: `${environment.apiUrl}enquiry/entranceExamFee`,

    createExpenses: `${environment.apiUrl}expenses/create`,
    getExpenses: `${environment.apiUrl}expenses`,

    createPayments: `${environment.apiUrl}payments/create`,
    getPaymentsById: `${environment.apiUrl}payments/`,
}