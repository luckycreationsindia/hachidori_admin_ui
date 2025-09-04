import {ApiSuccessResponse} from "@/interfaces/api_response";
import {Role} from "@/types/user-role";

export interface IUser {
    id: number;
    name?: string;
    email: string;
    password: string;
    role: Role;
    status: boolean;
}

export interface ProfileResponse extends ApiSuccessResponse {
    status: number;
    message?: string;
    data: IUser;
}

export interface UserResponse extends ApiSuccessResponse {
    status: number;
    message?: string;
    data: IUser;
}

export interface UserListResponse extends ApiSuccessResponse {
    status: number;
    message?: string;
    data: IUser[];
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: Role;
}

export {
    Role
}