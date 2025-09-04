"use client"

import * as React from "react"
import {
    Sidebar,
    SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import {
    IconAutomation,
    IconDashboard, IconScriptPlus,
} from "@tabler/icons-react";
import NavFooter from "@/components/NavFooter";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {ChevronDown} from "lucide-react";

export function NavigationMenu({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <Link href="/dashboard">
                                <Image src="/logo.png" alt="QuantoAdmin" width={32} height={32}/>
                                <span className="text-base font-semibold">Navigation</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent className="flex flex-col gap-2">
                        <SidebarMenu>
                            <SidebarMenuItem key="dashboard">
                                <SidebarMenuButton tooltip="Dashboard" asChild>
                                    <Link href="/dashboard">
                                        <IconDashboard/>
                                        <span>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                        <Collapsible className="group/collapsible">
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton>
                                    <IconAutomation size={16} className="text-sidebar-foreground"/>
                                    <span>{"Workflow"}</span>
                                    <ChevronDown
                                        className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"/>
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarGroupContent>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem key="workflow">
                                            <SidebarMenuButton tooltip="Manage Workflow" asChild>
                                                <Link href="/workflow">
                                                    <IconAutomation/>
                                                    <span>List</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuSubItem>
                                        <SidebarMenuSubItem key="workflow-add">
                                            <SidebarMenuButton tooltip="Add Workflow" asChild>
                                                <Link href="/workflow/add">
                                                    <IconScriptPlus/>
                                                    <span>Add</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </Collapsible>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavFooter/>
            </SidebarFooter>
        </Sidebar>
    )
}

export default NavigationMenu;
