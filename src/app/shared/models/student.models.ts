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
    dateOfJoining: Date;
    CurrentClassName: string;
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
    studentId: string;
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