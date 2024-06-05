export interface ISubjectModel{
    id: number;
    subjectName: string;
}

export interface IExamModel {
    id: number;
    examName: string;
}

export interface IClasses {
    id: number;
    className: string;
}

export interface ISubjectExamModel {
    id: number;
    exam: IExamModel;
    subject: ISubjectModel;
    classes: IClasses;
}

export interface IClassSubject {
    id: number;
    subject: number;
    classId: number;
    teacherId: number;
    isClassTeacher: boolean;
    academicYearId: number;
}