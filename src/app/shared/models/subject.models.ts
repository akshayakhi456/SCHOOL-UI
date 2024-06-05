export interface IAddMarks {
    id: number;
    sid: number;
    rollNo: number;
    sName: string;
    acedamicYearId: number;
    subject: string;
    examName: string;
    marks: string;
}

export interface IClassWiseSubject {
    id: number;
    subject: string
}

export interface IClassWiseSubjectSave {
    id: number;
    subjectId: number;
    classId: number;
    academicYearId: number;
}