"use client"

import {Separator} from "@/components/ui/separator"
import {SidebarTrigger} from "@/components/ui/sidebar"
import Notification from "@/components/Notification";
import * as React from "react";
import LogoutAlert from "@/components/LogoutAlert";
import DarkLightSwitch from "@/components/DarkLightSwitch";
import Image from "next/image";
import {useHeaderTitle} from "@/context/HeaderTitleContext";

export function Header() {
    const {title} = useHeaderTitle();
    return (
        <header
            className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1"/>
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium hidden sm:block">{title}</h1>
                <Image src="/logo.png" alt="Hachidori Admin" width={30} height={30} className="block sm:hidden"/>
                <div className="flex items-center gap-2 ml-auto">
                    <Notification/>
                    <DarkLightSwitch/>
                    <LogoutAlert/>
                </div>
            </div>
        </header>
    )
}

export default Header;