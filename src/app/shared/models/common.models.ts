export interface IDialogContent {
    title: string;
    body: string;
    btnPrimaryText?: string;
    btnCancelText?: string;
}

export interface IHttpResponse {
    statusCode: number;
    message: string;
    version: string;
}

export const ROLES = {
    USER: 'USER',
    OWNER: 'OWNER',
    ADMIN: 'ADMIN',
    TEACHER: 'TEACHER',
    PARENT: 'PARENT'
}