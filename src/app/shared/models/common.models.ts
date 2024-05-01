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