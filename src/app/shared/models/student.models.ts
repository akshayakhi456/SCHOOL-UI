export interface IStudent {
    id: number;
    firstName: string;
    lastName: string;
    dob: string;
    className: string;
    section: string;
    status: boolean;
    gender: string;
    photo: string;
    adharNumber: string;
    sibilings: string;
    certificateNames: string;
    dateOfJoining: Date | string;
    currentClassName: number;
    classes?: IClass;
}

export interface IClass {
    id: number;
    className: string;
}

export interface IGuardian {
    id: number;
    firstName: string;
    lastName: string;
    occupation: string;
    qualification: string;
    contactNumber: string;
    email: string;
    adharNumber: string;
    studentId: string | null | number;
    relationship: string;
}

export interface IAddress {
    id: number;
    HouseNo: string;
    streetName: string;
    city: string;
    district: string;
    state: string;
    zipCode: string;
    country: string;
    studentId: number;
}

export interface IStudentGuardianResponse {
    students: IStudent,
    guardians: Array<IGuardian>,
    address: IAddress
}

export interface IStudentApplyLeave {
    id: number;
    purposeOfLeave: string;
    noOfDays: number;
    startDate: Date;
    endDate?: Date;
    remarks: string;
    approval: boolean;
    studentId: number;
    academicYearId: number;
    classId: number;
    sectionId: number;
}

export interface ITeacherLeaveApprove extends IStudentApplyLeave {
    rollNo: number;
    studentName: string;
}