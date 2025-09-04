'use client';

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ColumnDef} from "@tanstack/react-table";
import {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {format} from "date-fns";
import {CalendarIcon, Loader2} from "lucide-react";
import {cn} from "@/lib/utils";
import {toast} from "sonner";
import {DataTable} from "@/components/ui/data-table";
import {Workflow, WorkflowListResponse} from "@/interfaces/workflow";
import {
    CreateScheduleFormValues,
    createScheduleSchema,
    Schedule,
    ScheduleListResponse,
    ScheduleResponse
} from "@/interfaces/schedule";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const SchedulePage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [workflows, setWorkflows] = useState<Workflow[]>([]);

    const form = useForm<CreateScheduleFormValues>({
        resolver: zodResolver(createScheduleSchema),
        defaultValues: {
            title: "",
            description: "",
            startDate: new Date(),
            endDate: new Date(),
            workflowId: null,
        },
    });

    const fetchWorkflows = async () => {
        try {
            const response = await fetch('/api/workflow');
            if (!response.ok) {
                throw new Error('Failed to fetch workflows');
            }
            const data = await response.json() as WorkflowListResponse;
            setWorkflows(data.data);
        } catch (error) {
            console.error('Error fetching workflows:', error);
            toast.error('Failed to fetch workflows');
        }
    }

    const fetchSchedules = async () => {
        try {
            const response = await fetch('/api/schedule');
            if (!response.ok) {
                throw new Error('Failed to fetch schedules');
            }
            const data = await response.json() as ScheduleListResponse;
            setSchedules(data.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
            toast.error('Failed to fetch schedules');
        }
    }

    const fetchWorkflowsAndSchedules = async () => {
        setLoading(true);
        await fetchWorkflows();
        await fetchSchedules();
        setLoading(false);
    }

    useEffect(() => {
        fetchWorkflowsAndSchedules();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async (values: CreateScheduleFormValues) => {
        setIsSubmitting(true);
        try {
            const newSchedule = {
                id: schedules.length + 1,
                title: values.title,
                description: values.description ?? '',
                startDate: values.startDate,
                endDate: values.endDate,
                workflowId: values.workflowId!,
            } as Schedule;

            const response = await fetch('/api/schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSchedule),
            })

            if (!response.ok) {
                throw new Error('Failed to create schedule');
            }
            const data = await response.json() as ScheduleResponse;
            setSchedules((prev) => [...prev, data.data]);
            toast.success("Schedule created successfully!");
            setIsDialogOpen(false);
            form.reset();
        } catch (error) {
            toast.error("Failed to create schedule.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: ColumnDef<Schedule>[] = [
        {
            accessorKey: "title",
            header: "Title",
        },
        {
            accessorKey: "workflowId",
            header: "Workflow",
            cell: ({row}) => {
                const workflow = workflows.find(workflow => workflow.id === row.original.workflowId);
                return workflow ? workflow.title : "Unknown";
            },
        },
        {
            accessorKey: "startDate",
            header: "Start Date",
            cell: ({row}) => {
                const date = row.original.startDate;
                return format(date, "PPpp");
            },
        },
        {
            accessorKey: "endDate",
            header: "End Date",
            cell: ({row}) => {
                const date = row.original.endDate;
                return format(date, "PPpp");
            },
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Schedules</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Add Schedule</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <DialogHeader>
                                    <DialogTitle>Create Schedule</DialogTitle>
                                    <DialogDescription>
                                        Create a new schedule for a workflow.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="workflowId"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Workflow</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value?.toString() ?? ""}
                                                        onValueChange={(e) => field.onChange(parseInt(e))}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Workflow"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {workflows.map((workflow) => (
                                                                <SelectItem key={workflow.id}
                                                                            value={workflow.id.toString()}>
                                                                    {workflow.title}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="startDate"
                                        render={({field}) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className="text-left">Start Date</FormLabel>
                                                <div className="flex gap-2">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "w-auto pl-3 text-left font-normal",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {field.value ? (
                                                                        format(field.value, "PPP")
                                                                    ) : (
                                                                        <span>Pick a date</span>
                                                                    )}
                                                                    <CalendarIcon
                                                                        className="ml-auto h-4 w-4 opacity-50"/>
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={(date) => {
                                                                    if (date) {
                                                                        const updated = new Date(field.value ?? new Date());
                                                                        updated.setFullYear(date.getFullYear());
                                                                        updated.setMonth(date.getMonth());
                                                                        updated.setDate(date.getDate());
                                                                        field.onChange(updated);
                                                                    }
                                                                }}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <Input
                                                        type="time"
                                                        className="w-auto"
                                                        value={field.value ? format(field.value, "HH:mm") : ""}
                                                        onChange={(e) => {
                                                            const [hours, minutes] = e.target.value.split(":").map(Number);
                                                            const updated = new Date(field.value ?? new Date());
                                                            updated.setHours(hours);
                                                            updated.setMinutes(minutes);
                                                            field.onChange(updated);
                                                        }}
                                                    />
                                                </div>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="endDate"
                                        render={({field}) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className="text-left">End Date</FormLabel>
                                                <div className="flex gap-2">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "w-auto pl-3 text-left font-normal",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {field.value ? (
                                                                        format(field.value, "PPP")
                                                                    ) : (
                                                                        <span>Pick a date</span>
                                                                    )}
                                                                    <CalendarIcon
                                                                        className="ml-auto h-4 w-4 opacity-50"/>
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={(date) => {
                                                                    if (date) {
                                                                        const updated = new Date(field.value ?? new Date());
                                                                        updated.setFullYear(date.getFullYear());
                                                                        updated.setMonth(date.getMonth());
                                                                        updated.setDate(date.getDate());
                                                                        field.onChange(updated);
                                                                    }
                                                                }}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <Input
                                                        type="time"
                                                        className="w-auto"
                                                        value={field.value ? format(field.value, "HH:mm") : ""}
                                                        onChange={(e) => {
                                                            const [hours, minutes] = e.target.value.split(":").map(Number);
                                                            const updated = new Date(field.value ?? new Date());
                                                            updated.setHours(hours);
                                                            updated.setMinutes(minutes);
                                                            field.onChange(updated);
                                                        }}
                                                    />
                                                </div>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                        Create Schedule
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            {loading ? (
                <div className="flex items-center justify-center p-10">
                    <Loader2 className="animate-spin" size={32}/>
                </div>
            ) : (
                <DataTable columns={columns} data={schedules}/>
            )}
        </div>
    );
};

export default SchedulePage;