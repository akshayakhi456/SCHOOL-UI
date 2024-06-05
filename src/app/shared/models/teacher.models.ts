export interface IAddTeacherRequest {
    teacherDetails: ITeacherDetails;
    teacherExperience: Array<ITeacherExperience>;
}

export interface ITeacherDetails {
    id: number;
    empId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    phoneNumber: number;
    email: string;
    qualification: string;
    passOutYear: number;
}

export interface ITeacherExperience {
    id: number;
    empId: string;
    schoolName: string;
    startEndDate: string;
    designation: string;
    status: boolean;
}