export interface IExamDetails {
    id: number;
    subject: string;
    classId: number;
    examId: number;
    minMarks: string;
    maxMarks: string;
    isAddInTotal: boolean;
    willExamConduct: boolean;
    ExamDate: Date;
    academicYearId: number;
}