"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {LogOut} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import Link from "next/link";
import {signOut} from "next-auth/react";

const LogoutAlert = () => {
    const handleLogout = async () => {
        try {
            await signOut({ callbackUrl: '/login' });
        } catch (error) {
            console.error("Error during external API logout:", error);
        }
    };
    return (
        <TooltipProvider>
            <Tooltip>
                <AlertDialog>
                    <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                            <Link href="#"
                                className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2">
                                <LogOut size={20} className="icon-style mr-2"/>
                                <span className="sr-only">Logout</span>
                            </Link>
                        </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Logout</p>
                    </TooltipContent>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirmation</AlertDialogTitle>
                            <AlertDialogDescription>
                                <span>Are you sure you want to logout?</span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleLogout}
                            >
                                Logout
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Tooltip>
        </TooltipProvider>
    )
}

export default LogoutAlert;