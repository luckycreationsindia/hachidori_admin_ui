"use client";

import DashboardCalendar from "@/components/DashboardCalendar";
import {deserializeSchedules, Schedule} from "@/interfaces/schedule";
import {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {endOfDay, format, startOfDay} from "date-fns";
import EventOfTheDay from "@/components/EventOfTheDay";
import {useHeaderTitle} from "@/context/HeaderTitleContext";
import {toast} from "sonner";
import {useRef} from "react";

export default function Page() {
    const {setTitle} = useHeaderTitle();
    const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Schedule | null>(null);
    const [events, setEvents] = useState<Schedule[]>([]);
    const [todaysEvents, setTodaysEvents] = useState<Schedule[]>([]);
    const monthChangeTimeout = useRef<NodeJS.Timeout | null>(null);

    async function fetchEventsForMonth(date: Date): Promise<Schedule[]> {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        try {
            const response = await fetch(`/api/schedule?year=${year}&month=${month}&includeAll=true`);
            if (!response.ok) {
                throw new Error('Failed to fetch schedules');
            }
            const data = await response.json();
            if (data.status === 1) {
                return deserializeSchedules(data.data);
            }
        } catch (error) {
            console.error('Error fetching schedules:', error);
            toast.error('Failed to fetch schedules');
        }

        return [];
    }

    async function fetchTodaysEvents(): Promise<Schedule[]> {
        const today = new Date();
        const startDate = startOfDay(today).toISOString();
        const endDate = endOfDay(today).toISOString();

        try {
            const response = await fetch(
                `/api/schedule?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&includeAll=true`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch today's schedules");
            }

            const data = await response.json();
            if (data.status === 1) {
                return deserializeSchedules(data.data);
            }
        } catch (error) {
            console.error("Error fetching today's schedules:", error);
            toast.error("Failed to fetch today's schedules");
        }

        return [];
    }

    useEffect(() => {
        setTitle("Dashboard");
        return () => setTitle(process.env.NEXT_PUBLIC_APP_NAME || "");
    }, [setTitle])

    useEffect(() => {
        (async () => {
            setEvents(await fetchEventsForMonth(new Date()));
            setTodaysEvents(await fetchTodaysEvents());
        })();
    }, []);

    const handleEventClick = (event: Schedule) => {
        setSelectedEvent(event);
        setIsEventDialogOpen(true);
    }

    const handleMonthChange = async (newMonth: Date) => {
        if (monthChangeTimeout.current) {
            clearTimeout(monthChangeTimeout.current);
        }
        monthChangeTimeout.current = setTimeout(async () => {
            const monthEvents = await fetchEventsForMonth(newMonth);
            setEvents(monthEvents);
        }, 300);
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex-1">
                <DashboardCalendar events={events} handleEventClick={handleEventClick}
                                   onMonthChange={handleMonthChange}/>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <EventOfTheDay events={todaysEvents} handleEventClick={handleEventClick}/>
            </div>
            {selectedEvent && (
                <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>
                                <span className="text-lg font-semibold">Event Details</span>
                            </DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium">Title:</span>
                            <span className="text-sm">{selectedEvent.title}</span>
                            <span className="text-sm font-medium">Date:</span>
                            <span className="text-sm">{format(selectedEvent.startDate, 'dd-MM-yyyy HH:mm')}</span>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}