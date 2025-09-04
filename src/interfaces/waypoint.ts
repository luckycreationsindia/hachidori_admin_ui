/* eslint-disable */
import {ApiSuccessResponse} from "@/interfaces/api_response";

export interface NodeDetail {
    Node_ID: number;
    NodeName: string;
    Node_X: number;
    Node_Y: number;
    IsDestn: number;
    SpecialNode: number;
}

export interface Command {
    command: string;
    args: {
        destination: number;
        visibility: boolean;
        delay?: number;
        interruptible?: boolean;
        interruptibleStatus?: string;
        interruptibleFromUi?: boolean;
        playDropSound?: boolean;
    };
}

export interface Workflow {
    workflowID: number;
    workflowName: string;
    mapName: string;
    workflowType: string;
    commands: Command[];
}

export interface MapData {
    Header: any[];
    NodeDetails: NodeDetail[];
    RouteMap: any[];
}

export interface Map {
    workflowCount: number;
    mapName: string;
    createdAt: string;
    updatedAt: string;
    workflows: Workflow[];
}

interface MapResponseData {
    map: Map;
    data: MapData
}

export interface MapResponse extends ApiSuccessResponse {
    data: MapResponseData;
}