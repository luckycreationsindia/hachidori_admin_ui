import {parseISO, isToday, format} from "date-fns";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {CalendarEvent} from "@/interfaces/calendar";

interface EventOfTheDayProps {
    events: CalendarEvent[];
    handleEventClick: (event: CalendarEvent) => void;
}

export default function EventOfTheDay({events, handleEventClick}: EventOfTheDayProps) {
    return (
        <div className="mt-6">
            <Card className="w-full shadow-sm border border-gray-200">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-gray-800">
                        Today&apos;s Schedules
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {events.filter((event) => isToday(parseISO(event.date))).length === 0 ? (
                        <p className="text-sm text-gray-500">No schedules for today 🎉</p>
                    ) : (
                        <ul className="space-y-3">
                            {events
                                .filter((event) => isToday(parseISO(event.date)))
                                .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
                                .map((event) => (
                                    <li
                                        key={event.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEventClick(event);
                                        }}
                                        className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-800">{event.title}</span>
                                            <span className="text-xs text-gray-500">
                                                {format(parseISO(event.date), "HH:mm")}
                                            </span>
                                        </div>
                                        <Badge className={event.color || "bg-blue-100 text-blue-700"}>
                                            {format(parseISO(event.date), "HH:mm")}
                                        </Badge>
                                    </li>
                                ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}