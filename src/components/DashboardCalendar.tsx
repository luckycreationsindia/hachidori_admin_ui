"use client"

import {JSX, useState} from "react";
import {
    addDays,
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    parseISO
} from "date-fns";
import {Card, CardContent} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {CalendarEvent} from "@/interfaces/calendar";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";

interface CalendarProps {
    events: CalendarEvent[];
    handleEventClick: (event: CalendarEvent) => void;
}

export default function DashboardCalendar({events, handleEventClick}: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isSelectedDayDialogOpen, setIsSelectedDayDialogOpen] = useState(false);
    const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([]);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, {weekStartsOn: 1});
    const endDate = endOfWeek(monthEnd, {weekStartsOn: 1});

    const rows: JSX.Element[] = [];
    let days: JSX.Element[] = [];
    let day = startDate;

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            const dayEvents = events.filter((e) =>
                isSameDay(parseISO(e.date), day)
            );

            days.push(
                <div
                    key={day.toString()}
                    className={cn(
                        "h-18 lg:h-28 border p-1 flex flex-col rounded-lg transition-colors hover:bg-gray-50",
                        !isSameMonth(day, monthStart) ? "bg-gray-50 text-gray-400" : "bg-white",
                        isSameDay(day, new Date()) ? "border-blue-500" : "border-gray-200",
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDayEvents(dayEvents);
                        setIsSelectedDayDialogOpen(true);
                    }}
                >
                    <div className="text-xs font-medium mb-1">{format(day, "d")}</div>
                    <div className="flex flex-col gap-1 overflow-hidden">
                        {dayEvents
                            .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
                            .slice(0, 2).map((event, idx) => (
                            <span
                                key={event.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEventClick(event);
                                }}
                                className={cn(
                                    "text-xs truncate rounded px-1 py-0.5 hover:cursor-pointer",
                                    event.color || "bg-blue-100 text-blue-700",
                                    idx > 0 ? "hidden lg:inline" : "",
                                    idx > 1 ? "hidden xl:inline" : ""
                                )}
                            >
                {event.title}
              </span>
                        ))}
                        {dayEvents.length > 1 && (
                            <span className="text-[10px] text-gray-500 lg:hidden">+{dayEvents.length - 1} more</span>
                        )}
                        {dayEvents.length > 2 && (
                            <span className="hidden lg:inline text-[10px] text-gray-500">+{dayEvents.length - 2} more</span>
                        )}
                    </div>
                </div>
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div key={day.toString()} className="grid grid-cols-7 gap-1">
                {days}
            </div>
        );
        days = [];
    }

    return (
        <div>
            <Card className="w-full shadow-none border-none">
                <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => setCurrentMonth(addDays(currentMonth, -30))} className="text-sm">← Prev
                        </button>
                        <h2 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
                        <button onClick={() => setCurrentMonth(addDays(currentMonth, 30))} className="text-sm">Next →
                        </button>
                    </div>
                    <div className="grid grid-cols-7 text-xs font-medium text-gray-500 mb-2">
                        {"Mon Tue Wed Thu Fri Sat Sun".split(" ").map((d) => (
                            <div key={d} className="text-center">{d}</div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-1">{rows}</div>
                </CardContent>
            </Card>
            {selectedDayEvents.length > 0 && (
                <Dialog open={isSelectedDayDialogOpen} onOpenChange={setIsSelectedDayDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>
                                <span className="text-lg font-semibold">Events for {format(parseISO(selectedDayEvents[0].date), 'dd-MM-yyyy')}</span>
                            </DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                {selectedDayEvents.map((event) => (
                                    <div key={event.id}
                                         className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors hover:cursor-pointer"
                                         onClick={(e) => {
                                             e.stopPropagation();
                                             handleEventClick(event);
                                         }}>
                                        <span
                                            className={cn(
                                                "h-2 w-2 rounded-full",
                                                event.color || "bg-blue-500"
                                            )}
                                        />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">{event.title}</div>
                                            <div className="text-xs text-gray-500">{event.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
