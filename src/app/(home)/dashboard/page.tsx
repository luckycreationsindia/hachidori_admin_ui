"use client";

import DashboardCalendar from "@/components/DashboardCalendar";
import {CalendarEvent} from "@/interfaces/calendar";
import {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {format} from "date-fns";
import EventOfTheDay from "@/components/EventOfTheDay";
import {useHeaderTitle} from "@/context/HeaderTitleContext";

export default function Page() {
    const {setTitle} = useHeaderTitle();
    const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    useEffect(() => {
        setTitle("Dashboard");
        return () => setTitle(process.env.NEXT_PUBLIC_APP_NAME || "");
    }, [setTitle])

    const events = [
        {id: 1, title: "Schedule 1", date: "2025-09-05T12:45:00.000Z", color: "bg-red-100 text-red-700"},
        {id: 2, title: "Schedule 2", date: "2025-09-07T14:00:00.000Z"},
        {id: 3, title: "Schedule 3", date: "2025-09-15T10:00:00.000Z"},
        {id: 4, title: "Schedule 4", date: "2025-09-15T13:00:00.000Z"},
        {id: 5, title: "Schedule 5", date: "2025-09-15T15:00:00.000Z"},
        {id: 6, title: "Schedule 6", date: "2025-09-15T18:00:00.000Z"},
    ];

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setIsEventDialogOpen(true);
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex-1">
                <DashboardCalendar events={events} handleEventClick={handleEventClick}/>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <EventOfTheDay events={events} handleEventClick={handleEventClick}/>
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
                            <span className="text-sm">{format(selectedEvent.date, 'dd-MM-yyyy HH:mm')}</span>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}