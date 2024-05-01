export interface IEnquiryFeedback {
    id?: number;
    enquiryId: number;
    feedback: string;
    createdAt: Date;
    createdBy: string;
}