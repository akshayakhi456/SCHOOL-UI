export interface IExamDetails {
    id: number;
    subjectId: number;
    subjectName: string;
    classId: number;
    examId: number;
    minMarks: string;
    maxMarks: string;
    isAddInTotal: boolean;
    willExamConduct: boolean;
    ExamDate: Date;
    academicYearId: number;
}