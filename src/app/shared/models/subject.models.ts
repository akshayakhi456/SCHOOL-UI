export interface IAddMarks {
    id: number;
    sid: number;
    rollNo: number;
    sName: string;
    acedamicYearId: number;
    subjectId: number;
    examId: number;
    marks: string;
    remarks: string;
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

export interface IProgressCardResponseModel
{
    studentInfo: IStudentInfo 
    subjectInfos: Array<ISubjectInfo> 
}

export interface IStudentInfo
{
    id: number;
    studentName: string;
    fatherName: string;
    motherName: string;
    admNo: number;
    rollNo: number;
    className: string;
    section: string;
    dateOfBirth: string;
}

export interface ISubjectInfo
{
    id: number;
    subjectName: string;
    maxMarks: number;
    marks: number;
    remarks: string;
}