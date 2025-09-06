import {isToday, format} from "date-fns";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Schedule} from "@/interfaces/schedule";

interface EventOfTheDayProps {
    events: Schedule[];
    handleEventClick: (event: Schedule) => void;
}

export default function EventOfTheDay({events, handleEventClick}: EventOfTheDayProps) {
    return (
        <div className="mt-6">
            <Card className="w-full shadow-sm border border-gray-200">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">
                        Today&apos;s Schedules
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {events.filter((event) => isToday(event.startDate)).length === 0 ? (
                        <p className="text-sm text-accent-foreground">No schedules for today 🎉</p>
                    ) : (
                        <ul className="space-y-3">
                            {events
                                .filter((event) => isToday(event.startDate))
                                .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                                .map((event) => (
                                    <li
                                        key={event.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEventClick(event);
                                        }}
                                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{event.title}</span>
                                            <span className="text-xs text-gray-500">
                                                {format(event.startDate, "HH:mm")}
                                            </span>
                                        </div>
                                        <Badge className={"bg-blue-100 text-blue-700"}>
                                            {format(event.startDate, "HH:mm")}
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