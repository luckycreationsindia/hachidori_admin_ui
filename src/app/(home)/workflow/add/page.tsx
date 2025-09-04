'use client';

import React, {MouseEvent, useEffect, useRef, useState, WheelEvent} from 'react';
import {Command, MapData, MapResponse, NodeDetail, Workflow} from "@/interfaces/waypoint";
import {Button} from '@/components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Separator} from '@/components/ui/separator';
import {toast} from "sonner";
import NodePoint from "@/components/NodePoint";
import {Loader2} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';

// Hardcoded data from the provided JSON files for demonstration
// const mapData: MapData = {
//     "Header": [
//         {
//             "Record_Time_Stamp": "2025-09-02 14:20:12",
//             "location_Detail": "map1",
//             "Num_of_Nodes": 33,
//             "Layout_X": 100000,
//             "Layout_Y": 120000,
//             "Offset_X": -10000,
//             "Offset_Y": -45000,
//             "beaconNetworkID": "E5CE"
//         }
//     ],
//     "NodeDetails": [
//         {"Node_ID": 0, "NodeName": "LOADING", "Node_X": -3200, "Node_Y": 75700, "IsDestn": 1, "SpecialNode": 0},
//         {"Node_ID": 1, "NodeName": "J1", "Node_X": -3100, "Node_Y": 75700, "IsDestn": 1, "SpecialNode": 0},
//         {"Node_ID": 2, "NodeName": "N2", "Node_X": -3100, "Node_Y": 75700, "IsDestn": 0, "SpecialNode": 0},
//         {"Node_ID": 3, "NodeName": "N3", "Node_X": 2000, "Node_Y": 73200, "IsDestn": 0, "SpecialNode": 0},
//         {"Node_ID": 4, "NodeName": "N4", "Node_X": 2100, "Node_Y": 60000, "IsDestn": 0, "SpecialNode": 0},
//         {"Node_ID": 5, "NodeName": "J2", "Node_X": 2000, "Node_Y": 20000, "IsDestn": 1, "SpecialNode": 0},
//         {"Node_ID": 6, "NodeName": "N6", "Node_X": 2000, "Node_Y": 3860, "IsDestn": 0, "SpecialNode": 0},
//         {"Node_ID": 7, "NodeName": "N7", "Node_X": 15000, "Node_Y": 2360, "IsDestn": 0, "SpecialNode": 0},
//         {"Node_ID": 8, "NodeName": "H-M1", "Node_X": 33895, "Node_Y": 2360, "IsDestn": 1, "SpecialNode": 0},
//         {"Node_ID": 9, "NodeName": "H-M2", "Node_X": 41674, "Node_Y": 2360, "IsDestn": 1, "SpecialNode": 0},
//         {"Node_ID": 10, "NodeName": "H-M3", "Node_X": 53892, "Node_Y": 2360, "IsDestn": 1, "SpecialNode": 0},
//         {"Node_ID": 11, "NodeName": "H-M4", "Node_X": 59400, "Node_Y": 2360, "IsDestn": 1, "SpecialNode": 0},
//         {"Node_ID": 12, "NodeName": "N12", "Node_X": 60000, "Node_Y": 2360, "IsDestn": 0, "SpecialNode": 0},
//         {"Node_ID": 13, "NodeName": "N13", "Node_X": 60000, "Node_Y": 2360, "IsDestn": 0, "SpecialNode": 0},
//         {"Node_ID": 14, "NodeName": "Home", "Node_X": 58000, "Node_Y": 2360, "IsDestn": 1, "SpecialNode": 1},
//         {"Node_ID": 15, "NodeName": "H-E4", "Node_X": 51917, "Node_Y": 2360, "IsDestn": 1, "SpecialNode": 0},
//         {"Node_ID": 16, "NodeName": "H-E3", "Node_X": 44674, "Node_Y": 2360, "IsDestn": 1, "SpecialNode": 0},
//         {"Node_ID": 17, "NodeName": "H-E2", "Node_X": 33400, "Node_Y": 2360, "IsDestn": 1, "SpecialNode": 0},
//         {"Node_ID": 18, "NodeName": "H-E1", "Node_X": 31000, "Node_Y": 2360, "IsDestn": 1, "SpecialNode": 0},
//         {"Node_ID": 19, "NodeName": "S-1", "Node_X": 21418, "Node_Y": 2360, "IsDestn": 1, "SpecialNode": 0},
//         {"Node_ID": 20, "NodeName": "S-2", "Node_X": 15579, "Node_Y": 2360, "IsDestn": 1, "SpecialNode": 0},
//         {"Node_ID": 21, "NodeName": "S-3", "Node_X": 10795, "Node_Y": 2360, "IsDestn": 1, "SpecialNode": 0},
//         {"Node_ID": 22, "NodeName": "S-4", "Node_X": 2000, "Node_Y": 7000, "IsDestn": 1, "SpecialNode": 0},
//         {"Node_ID": 23, "NodeName": "N23", "Node_X": 2000, "Node_Y": 2360, "IsDestn": 0, "SpecialNode": 0},
//         {"Node_ID": 24, "NodeName": "J3", "Node_X": 2000, "Node_Y": 12000, "IsDestn": 1, "SpecialNode": 0},
//         {"Node_ID": 25, "NodeName": "N25", "Node_X": 2000, "Node_Y": 37000, "IsDestn": 0, "SpecialNode": 0},
//         {"Node_ID": 26, "NodeName": "J4", "Node_X": 2000, "Node_Y": 69600, "IsDestn": 1, "SpecialNode": 0},
//         {"Node_ID": 27, "NodeName": "N27", "Node_X": 2000, "Node_Y": 73400, "IsDestn": 0, "SpecialNode": 0},
//         {"Node_ID": 28, "NodeName": "N28", "Node_X": -4000, "Node_Y": 75550, "IsDestn": 0, "SpecialNode": 0},
//         {"Node_ID": 29, "NodeName": "UNLOADING", "Node_X": -12000, "Node_Y": 75700, "IsDestn": 1, "SpecialNode": 0},
//         {"Node_ID": 30, "NodeName": "N31", "Node_X": -14000, "Node_Y": 75700, "IsDestn": 0, "SpecialNode": 0},
//         {"Node_ID": 31, "NodeName": "N32", "Node_X": -14000, "Node_Y": 75700, "IsDestn": 0, "SpecialNode": 0},
//         {"Node_ID": 32, "NodeName": "N33", "Node_X": 7000, "Node_Y": 2260, "IsDestn": 0, "SpecialNode": 0}
//     ],
//     "RouteMap": []
// };
//
// // Hardcoded workflow data from map1_active (1).json
// const workflowData: Workflow[] = [
//     {
//         "workflowID": 1, "workflowName": "Master", "mapName": "map1", "workflowType": "HT", "commands": [
//             {"command": "navigate", "args": {"destination": 14, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 15, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 16, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 17, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 18, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 19, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 20, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 21, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 22, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 24, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 26, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 29, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 0, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 5, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 8, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 9, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 10, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 11, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 14, "visibility": true}}
//         ]
//     },
//     {
//         "workflowID": 2, "workflowName": "H1 - Diff_Ring", "mapName": "map1", "workflowType": "HT", "commands": [
//             {"command": "navigate", "args": {"destination": 14, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 19, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 24, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 26, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 29, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 0, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 5, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 8, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 14, "visibility": true}}
//         ]
//     },
//     {
//         "workflowID": 3, "workflowName": "H2 - PDD", "mapName": "map1", "workflowType": "HT", "commands": [
//             {"command": "navigate", "args": {"destination": 14, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 17, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 20, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 24, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 26, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 29, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 0, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 5, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 9, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 14, "visibility": true}}
//         ]
//     },
//     {
//         "workflowID": 4, "workflowName": "H3 - Driven", "mapName": "map1", "workflowType": "HT", "commands": [
//             {"command": "navigate", "args": {"destination": 14, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 16, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 21, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 24, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 26, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 29, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 0, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 5, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 10, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 14, "visibility": true}}
//         ]
//     },
//     {
//         "workflowID": 5, "workflowName": "H4 - GC_Drive", "mapName": "map1", "workflowType": "HT", "commands": [
//             {"command": "navigate", "args": {"destination": 14, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 15, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 22, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 24, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 26, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 29, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 0, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 5, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 11, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 14, "visibility": true}}
//         ]
//     },
//     {
//         "workflowID": 6, "workflowName": "testing", "mapName": "map1", "workflowType": "HDC", "commands": [
//             {"command": "navigate", "args": {"destination": 7, "visibility": true}},
//             {"command": "navigate", "args": {"destination": 13, "visibility": true}}
//         ]
//     },
// ];

const App: React.FC = () => {
    const [selectedNodes, setSelectedNodes] = useState<NodeDetail[]>([]);
    const [isMapMode, setIsMapMode] = useState<boolean>(false);
    const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | null>(null);
    const [workflowData, setWorkflowData] = useState<Workflow[]>([]);
    const [mapData, setMapData] = useState<MapData>();
    const [loading, setLoading] = useState<boolean>(false);

    const [scaleFactor, setScaleFactor] = useState<number>(150);
    const [mapOffset, setMapOffset] = useState<{ x: number; y: number }>({x: -20000, y: -50000});
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [startDragPos, setStartDragPos] = useState<{ x: number; y: number }>({x: 0, y: 0});
    const mapRef = useRef<HTMLDivElement>(null);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const minScaleFactor: number = 200;
    const maxScaleFactor: number = 50;
    const zoomStep: number = 10;

    useEffect(() => {
        const fetchMap = async () => {
            setLoading(true);
            try {
                const id: number = 1;
                const url = `/api/map/${id}`;

                const response = await fetch(url);
                if (!response.ok) throw new Error(
                    `HTTP error! Status: ${response.status}`
                )

                const responseData: MapResponse = await response.json();

                if (responseData.status === 1) {
                    setWorkflowData(responseData.data.map.workflows);
                    setMapData(responseData.data.data);
                } else {
                    toast.error('Error fetching map data');
                }
            } catch (err) {
                console.error('Error fetching map data:', err);
                toast.error('Error fetching map data');
            } finally {
                setLoading(false);
            }
        }

        fetchMap();
    }, []);

    useEffect(() => {
        const mapContainer = mapRef.current;
        if (mapContainer) {
            const handleWheel = (e: WheelEvent) => {
                e.preventDefault();
                if (e.deltaY < 0) {
                    handleZoom('in');
                } else {
                    handleZoom('out');
                }
            };

            const handleMouseMove = (e: MouseEvent) => {
                if (!isDragging) return;
                const dx: number = e.clientX - startDragPos.x;
                const dy: number = e.clientY - startDragPos.y;

                setMapOffset(prevOffset => ({
                    x: prevOffset.x - dx * scaleFactor,
                    y: prevOffset.y - dy * scaleFactor
                }));

                setStartDragPos({x: e.clientX, y: e.clientY});
            };

            const handleMouseUp = () => {
                setIsDragging(false);
            };

            mapContainer.addEventListener('wheel', handleWheel as unknown as EventListener);
            mapContainer.addEventListener('mousemove', handleMouseMove as unknown as EventListener);
            mapContainer.addEventListener('mouseup', handleMouseUp);
            mapContainer.addEventListener('mouseleave', handleMouseUp);

            return () => {
                mapContainer.removeEventListener('wheel', handleWheel as unknown as EventListener);
                mapContainer.removeEventListener('mousemove', handleMouseMove as unknown as EventListener);
                mapContainer.removeEventListener('mouseup', handleMouseUp);
                mapContainer.removeEventListener('mouseleave', handleMouseUp);
            };
        }
    }, [isDragging, startDragPos, scaleFactor]);

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 size={50} color="#000000" className="animate-spin"/>
        </div>
    )

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragging(true);
        setStartDragPos({x: e.clientX, y: e.clientY});
    };

    const handleZoom = (direction: 'in' | 'out'): void => {
        setScaleFactor((prevScale: number): number => {
            let newScale: number = prevScale;
            if (direction === 'in' && prevScale > maxScaleFactor) {
                newScale = Math.max(prevScale - zoomStep, maxScaleFactor);
            } else if (direction === 'out' && prevScale < minScaleFactor) {
                newScale = Math.min(prevScale + zoomStep, minScaleFactor);
            }
            return newScale;
        });
    };

    const handleWorkflowSelect = (value: string): void => {
        const id: number = parseInt(value);
        setSelectedWorkflowId(id);
        setSelectedNodes([]);
    };

    const getFilteredNodes = (): NodeDetail[] => {
        if (selectedWorkflowId === null) {
            return [];
        }
        const selectedWorkflow: Workflow | undefined = workflowData.find(wf => wf.workflowID === selectedWorkflowId);
        if (!selectedWorkflow) {
            return [];
        }

        const nodeIdsInWorkflow: number[] = selectedWorkflow.commands
            .filter((cmd: Command) => cmd.command === 'navigate')
            .map((cmd: Command) => cmd.args.destination);

        return mapData!.NodeDetails.filter((node: NodeDetail) => node.IsDestn === 1 && nodeIdsInWorkflow.includes(node.Node_ID));
    };


    const handleNodeClick = (node: NodeDetail): void => {
        setSelectedNodes((prevSelected: NodeDetail[]): NodeDetail[] => {
            const lastSelectedNode: NodeDetail | undefined = prevSelected[prevSelected.length - 1];

            if (lastSelectedNode && lastSelectedNode.Node_ID === node.Node_ID) {
                toast.error('Cannot select the same node twice in a row.');
                return prevSelected;
            } else {
                return [...prevSelected, node];
            }
        });
    };

    const handleRemoveNode = (indexToRemove: number): void => {
        setSelectedNodes((prevSelected: NodeDetail[]): NodeDetail[] => {
            const newSelectedNodes: NodeDetail[] = prevSelected.filter((_, index: number) => index !== indexToRemove);
            return newSelectedNodes;
        });
    };

    const generateJobId = (): void => {
        if (selectedWorkflowId === null) {
            toast.error('Please select a workflow first.');
            return;
        }
        if (selectedNodes.length < 1) {
            toast.error('Please select at least one node.');
            return;
        }

        setTitle('');
        setDescription('');
        setIsDialogOpen(true);
    };

    const handleSaveJob = async (): Promise<void> => {
        if (selectedWorkflowId === null) {
            toast.error('Please select a workflow first.');
            return;
        }
        if (selectedNodes.length < 1) {
            toast.error('Please select at least one node.');
            return;
        }

        setIsSubmitting(true);
        try {
            const waypoints: string = selectedNodes.map((node: NodeDetail) => node.Node_ID.toString().padStart(4, '0')).join('');
            const newJobId: string = `JD${selectedWorkflowId}S${selectedNodes.length}S${waypoints}`;
            const data = {title, description, data: newJobId}

            const response = await fetch('/api/workflow', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.message);
            } else {
                toast.success('Workflow saved successfully!');
                setIsDialogOpen(false);
                setSelectedNodes([]);
                setTitle('');
                setDescription('');
            }
        } catch (error) {
            console.error('Error saving workflow:', error);
            toast.error('Error saving workflow');
        } finally {
            setIsSubmitting(false);
        }
    }

    const toggleMode = (): void => {
        setIsMapMode((prev: boolean): boolean => !prev);
    };

    const destinationNodes: NodeDetail[] = getFilteredNodes();

    return (
        <div className="min-h-screen p-4 font-sans flex flex-col items-center">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">Waypoint Builder</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center mb-6 space-y-4">
                        <div className="w-full">
                            <Label htmlFor="workflow-select" className="block text-center text-lg font-medium mb-2">
                                Select a Workflow:
                            </Label>
                            <Select onValueChange={handleWorkflowSelect}
                                    value={selectedWorkflowId !== null ? selectedWorkflowId.toString() : ''}>
                                <SelectTrigger className="w-full md:w-1/2 mx-auto">
                                    <SelectValue placeholder="-- Choose Workflow --"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {workflowData.map((wf: Workflow) => (
                                        <SelectItem key={wf.workflowID} value={wf.workflowID.toString()}>
                                            {wf.workflowName} ({wf.workflowType})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-center space-x-4">
                            <Button onClick={generateJobId} variant="default" className="hover:bg-gray-700">
                                Save Job
                            </Button>
                            <Button onClick={() => setSelectedNodes([])} variant="destructive"
                                    className="hover:bg-gray-700">
                                Clear Selection
                            </Button>
                            <Button onClick={toggleMode} variant="secondary"
                                    className="hover:bg-gray-700 hover:text-white">
                                Switch to {isMapMode ? 'Simple Mode' : 'Map Mode'}
                            </Button>
                        </div>
                        <div className="flex justify-center space-x-4">
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Save New Job</DialogTitle>
                                        <DialogDescription>
                                            Enter a name and description for this job. Both are optional.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-2 pb-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="job-name">Job Name (Optional)</Label>
                                            <Input id="job-name" disabled={isSubmitting} value={title}
                                                   onChange={(e) => setTitle(e.target.value)}/>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="job-description">Description (Optional)</Label>
                                            <Input id="job-description" disabled={isSubmitting} value={description}
                                                   onChange={(e) => setDescription(e.target.value)}/>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" disabled={isSubmitting}
                                                onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                        <Button disabled={isSubmitting} onClick={handleSaveJob}>
                                            {isSubmitting ? 'Saving...' : 'Save'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <Separator className="my-4"/>

                    {isMapMode ? (
                        <>
                            <div className="flex justify-center mb-4 items-center space-x-4">
                                <Button onClick={() => handleZoom('in')} variant="outline" size="icon">
                                    +
                                </Button>
                                <span
                                    className="text-sm font-semibold">Zoom Level: {((1 / scaleFactor) * 100).toFixed(0)}%</span>
                                <Button onClick={() => handleZoom('out')} variant="outline" size="icon">
                                    -
                                </Button>
                            </div>
                            <div
                                id="map-container"
                                ref={mapRef}
                                onMouseDown={handleMouseDown}
                                className={`relative w-full h-[800px] rounded-lg shadow-inner bg-gray-800 overflow-hidden grid-background-svg ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                            >
                                {destinationNodes.map((node: NodeDetail) => (
                                    <NodePoint
                                        key={node.Node_ID}
                                        node={node}
                                        isSelected={selectedNodes.some((n: NodeDetail) => n.Node_ID === node.Node_ID)}
                                        onClick={handleNodeClick}
                                        scaleFactor={scaleFactor}
                                        offset={mapOffset}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <ScrollArea className="p-4 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">Select Waypoints</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {destinationNodes.map((node: NodeDetail) => (
                                    <Button
                                        key={node.Node_ID}
                                        onClick={() => handleNodeClick(node)}
                                        className={`p-4 rounded-xl text-center font-semibold transition-colors duration-200 hover:cursor-pointer
                      ${selectedNodes.some((n: NodeDetail) => n.Node_ID === node.Node_ID)
                                            ? 'hover:bg-green-600 hover:text-white'
                                            : 'hover:bg-amber-200 hover:text-black'}
                    `}
                                        variant={selectedNodes.some((n: NodeDetail) => n.Node_ID === node.Node_ID) ? 'default' : 'secondary'}
                                    >
                                        {node.NodeName} ({node.Node_ID})
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    )}

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold">Selected Waypoints:</h3>
                        <ol className="mt-2 flex flex-wrap gap-2 list-decimal list-inside">
                            {selectedNodes.length > 0 ? (
                                selectedNodes.map((node: NodeDetail, index: number) => (
                                    <li key={`${node.Node_ID}-${index}`}
                                        className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        <span>{node.NodeName} ({node.Node_ID})</span>
                                        <Button
                                            onClick={() => handleRemoveNode(index)}
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto p-0 text-red-600 hover:text-red-800"
                                        >
                                            &times;
                                        </Button>
                                    </li>
                                ))
                            ) : (
                                <li className="text-amber-600">No nodes selected.</li>
                            )}
                        </ol>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default App;