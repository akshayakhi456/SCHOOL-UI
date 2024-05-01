export interface IRegisterRequest {
    firstName: string;
    lastName: string;
    userName?: string;
    email?: string;
    password?: string;
    role?: string;
}

export interface IHttpResponse<T> {
    statusCode: number;
    message: string;
    version: number;
    result?: T
}

export interface IChangePasswordResponse {
        result: {
            succeeded: string;
            errors: Array<{
                code: string,
                description: string
            }>
        }
}

export interface IChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}