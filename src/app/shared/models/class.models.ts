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
    sId?: string;
    rollNo?: number;
    className: string;
    section: string;
    sName?: string;
    month: string;
    Year: string;
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
    sId: string;
    className: string;
    section: string;
    month: string;
    year: string;
    date?: number;
    attendanceStatus?: string;
}

export interface AttendanceRecord {
    date: string;
    status: 'P' | 'A' | 'HD';
}