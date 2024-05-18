export const ACADEMIC_YEAR = [{
    label: '2024-25',
    value: 1,
    year: 2024
},
{
    label: '2025-26',
    value: 2,
    year: 2025
},
{
    label: '2026-27',
    value: 3,
    year: 2026
},
{
    label: '2027-28',
    value: 4,
    year: 2027
},
{
    label: '2028-29',
    value: 5,
    year: 2028
},
{
    label: '2029-30',
    value: 6,
    year: 2029
},
{
    label: '2030-31',
    value: 7,
    year: 2030
},
{
    label: '2031-32',
    value: 8,
    year: 2031
},
{
    label: '2032-33',
    value: 9,
    year: 2032
},
{
    label: '2033-34',
    value: 10,
    year: 2033
},
{
    label: '2034-35',
    value: 11,
    year: 2034
},
]


export interface IPaymentTransaction {
    payments: Payment;
    paymentTransactionDetails: IPaymentDetails;
}

export interface Payment {
    invoiceId?: number; // Assuming invoiceId is optional, as it might be generated automatically
    paymentName: string;
    paymentType: string;
    amount: number;
    remarks: string;
    dateOfPayment: Date;
    studentId: number;
    academicYearId: number;
    PaymentAllotmentId: number;
    dueDateOfPayment?: Date; // Optional dueDateOfPayment
  }

export interface IPayment {
    // invoiceId: number;
    paymentName?: string | null; // Ensure paymentName is a non-nullable string
    paymentType: string | null;
    amount: number | null;
    remarks: string | null;
    dateOfPayment: Date | null;
    studentId: number | null;
    acedamicYearId: number; // Fixed typo in 'academicYearId'
    dueDateOfPayment: Date | null;
    PaymentAllotmentId: number | null;
}

export interface  IPaymentDetails {
    id: number;
    invoiceId: number;
    transactionDetail: string;
}