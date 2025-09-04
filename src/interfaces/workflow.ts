import {ApiSuccessResponse} from "@/interfaces/api_response";

export interface Workflow {
    id: number;
    title: string;
    description?: string;
    data?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface WorkflowResponse extends ApiSuccessResponse {
    data: Workflow;
}

export interface WorkflowListResponse extends ApiSuccessResponse {
    data: Workflow[];
}