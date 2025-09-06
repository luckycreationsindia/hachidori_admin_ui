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
    color?: string;
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

export type ScheduleDTO = Omit<Schedule, "startDate" | "endDate" | "createdAt" | "updatedAt"> & {
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
};

export function deserializeSchedule(raw: ScheduleDTO): Schedule {
    return {
        ...raw,
        startDate: new Date(raw.startDate),
        endDate: new Date(raw.endDate),
        createdAt: new Date(raw.createdAt),
        updatedAt: new Date(raw.updatedAt),
    };
}

export function deserializeSchedules(raw: ScheduleDTO[]): Schedule[] {
    return raw.map(deserializeSchedule);
}