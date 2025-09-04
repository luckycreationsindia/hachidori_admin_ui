import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import Link from "next/link";
import {BellIcon} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

const Notification = () => {
    const unreadNotificationsCount = 2;
    return (
        <TooltipProvider>
            <Tooltip>
                <Popover>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <Link className='relative rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2' href='#' passHref>
                                <BellIcon size={20} className='icon-style'/>
                                {unreadNotificationsCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="
                                    absolute -top-1 -right-1
                                    h-5 w-5 p-0
                                    flex items-center justify-center
                                    rounded-full text-xs
                                    "
                                    >
                                        {unreadNotificationsCount}
                                    </Badge>
                                )}
                            </Link>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        Notifications
                    </TooltipContent>
                    <PopoverContent>
                        <div className="gap-4">
                            <div className="py-2">
                                <h4 className="leading-none font-medium">Title</h4>
                                <p className="text-muted-foreground text-sm">
                                    Simple Notification 1
                                </p>
                            </div>
                            <div className="py-2">
                                <h4 className="leading-none font-medium">Title</h4>
                                <p className="text-muted-foreground text-sm">
                                    Simple Notification 2
                                </p>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </Tooltip>
        </TooltipProvider>
    )
}

export default Notification;