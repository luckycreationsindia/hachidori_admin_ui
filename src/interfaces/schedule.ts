import {z} from "zod";
import {ApiSuccessResponse} from "@/interfaces/api_response";

export type Schedule = {
    id: number;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    parentId: number | null;
    parent: Schedule | null;
    children: Schedule[];
    workflowId: number | null;
    workflow: Schedule | null;
    createdAt: Date;
    updatedAt: Date;
};

export const createScheduleSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    startDate: z.date(),
    endDate: z.date(),
    parentId: z.number().int().nullable().optional(),
    workflowId: z.number().int().nullable().optional(),
});

export type CreateScheduleFormValues = z.infer<typeof createScheduleSchema>;

export interface ScheduleResponse extends ApiSuccessResponse {
    data: Schedule;
}

export interface ScheduleListResponse extends ApiSuccessResponse {
    data: Schedule[];
}