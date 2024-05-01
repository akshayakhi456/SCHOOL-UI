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
    changeStatusEnquiryStudent: `${environment.apiUrl}enquiry/changeStatusEnquiryStudent/`,
    saveFeedBack: `${environment.apiUrl}enquiry/SaveFeedBack`,
    feedbackList: `${environment.apiUrl}enquiry/FeedbackList/`,

    createExpenses: `${environment.apiUrl}expenses/create`,
    getExpenses: `${environment.apiUrl}expenses`,
    getExpensesGraph: `${environment.apiUrl}expenses/graph`,

    createPayments: `${environment.apiUrl}payments/create`,
    getPaymentsById: `${environment.apiUrl}payments/`,
    getclassWiseReport: `${environment.apiUrl}payments/classWiseReport`,
    getyearWiseReport: `${environment.apiUrl}payments/yearWiseReport`,
    postRecordsOfPayment: `${environment.apiUrl}payments/studentsRecordOfPayment`,

    createClassSettings: `${environment.apiUrl}settings/classes`,
    updateClassSettings: `${environment.apiUrl}settings/classes`,
    getClassesSettings: `${environment.apiUrl}settings/classes`,
    getClassSettingsById: `${environment.apiUrl}settings/classes/`,
    deleteClassesSettings: `${environment.apiUrl}settings/classes/`,
    createSectionSettings: `${environment.apiUrl}settings/section`,
    updateSectionSettings: `${environment.apiUrl}settings/section`,
    getSectionSettings: `${environment.apiUrl}settings/sections`,
    getSectionSettingsById: `${environment.apiUrl}settings/classes/`,
    deleteSectionSettings: `${environment.apiUrl}settings/section/`,
    enquiryQuestionsSettings: `${environment.apiUrl}settings/enquiryQuestion`,
    getEnquiryQuestionsSettings: `${environment.apiUrl}settings/enquiryQuestions`,
    paymentAllotmentsSettings: `${environment.apiUrl}settings/paymentAllotment`,
    
    registerUser: `${environment.apiUrl}Auth/register`,
    loginUser: `${environment.apiUrl}Auth/login`,

    roles: `${environment.apiUrl}AuthUser/roles`,
    updateUser: `${environment.apiUrl}AuthUser/updateUser`,
    registerUserDetail: `${environment.apiUrl}AuthUser/UserDetails`,
    me: `${environment.apiUrl}AuthUser/me`,
    changePassword: `${environment.apiUrl}AuthUser/changePassword`,

    dashboard: `${environment.apiUrl}dashboard`,

    invoice: `${environment.apiUrl}invoice`,
    invoiceId: `${environment.apiUrl}invoice/invoiceId`
}