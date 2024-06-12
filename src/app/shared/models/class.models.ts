export interface IstudentMapSection {
    id?: number;
    sId: string;
    rollNo: number;
    className: string;
    section: string;
    firstName: string;
    lastName: string;
    fatherName: string;
    academicYear: number;
}

export interface IstudentAttendance {
    id?: number;
    sId?: number;
    rollNo?: number;
    classId: number;
    section: number | null;
    sName?: string;
    month: string;
    year: string;
    d1?: string;
    d2?: string;
    d3?: string;
    d4?: string;
    d5?: string;
    d6?: string;
    d7?: string;
    d8?: string;
    d9?: string;
    d10?: string;
    d11?: string;
    d12?: string;
    d13?: string;
    d14?: string;
    d15?: string;
    d16?: string;
    d17?: string;
    d18?: string;
    d19?: string;
    d20?: string;
    d21?: string;
    d22?: string;
    d23?: string;
    d24?: string;
    d25?: string;
    d26?: string;
    d27?: string;
    d28?: string;
    d29?: string;
    d30?: string;
    d31?: string;
}

export interface IStudentAttendanceRequest {
    id?: number;
    sId?: number;
    classId: number;
    section: number;
    month: string;
    year: string;
    date?: number;
    attendanceStatus?: string;
}

export interface AttendanceRecord {
    date: string;
    status: 'P' | 'A' | 'HD';
}

export interface IStudentAttendanceMonthYearRequest {
    className: number;
    section: number;
    sId: string;
    startMonth: number;
    startYear: string;
    endMonth: number;
    endYear: string;
}

export interface IStudentAttendanceDisplay {
    absent: number;
    attendanceArray: Array<{
        date: Date | string,
        status: string
    }>;
    halfDay: number;
    present: number;
    total: number
}

export interface IStudentAssignSectionRequestModel {
    id: number;
    studentsid: number;
    sectionId: number;
    rollNo: number;
    classId: number;
    academicYearId: number
}

export interface IStudentAssignSectionResponseModel extends IStudentAssignSectionRequestModel {
    studentName: string;
    section: string;
}