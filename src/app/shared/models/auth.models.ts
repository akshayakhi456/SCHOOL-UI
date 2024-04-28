export interface IRegisterRequest {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    role: string;
}

export interface IHttpResponse {
    statusCode: number;
    message: string;
    version: number; 
}

export interface IRegisterUsers extends IHttpResponse {
    result: Array<IRegisterRequest>;
}

export interface IChangePasswordResponse extends IHttpResponse {
    result: {
        result: {
            succeeded: string;
            errors: Array<{
                code: string,
                description: string
            }>
        }
    };
}

export interface IChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}