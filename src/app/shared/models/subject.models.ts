export interface IAddMarks {
    id: number;
    sid: number;
    rollNo: number;
    sName: string;
    acedamicYearId: number;
    subjectId: number;
    examId: number;
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

export interface ISubjectRequestModel {
    id: number;
    classesId: number;
    sectionId: number;
    subjectId: number;
    TeacherDetailsId: number;
    isClassTeacher: boolean;
    academicYearId: number;
}

export interface ISubjectResponseModel extends ISubjectRequestModel {
    className: string;
    subject: string;
    section: string;
    teacher: string;
}