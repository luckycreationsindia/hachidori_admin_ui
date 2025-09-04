"use client"

import "../globals.css";
import Header from "@/components/Header";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import NavigationMenu from "@/components/NavigationMenu";
import React from "react";
import {HeaderTitleProvider} from "@/context/HeaderTitleContext";

export default function HomeLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }
            >
                <NavigationMenu variant="inset"/>
                <SidebarInset>
                    <HeaderTitleProvider>
                        <Header/>
                        <div className="flex flex-1 flex-col">
                            {children}
                        </div>
                    </HeaderTitleProvider>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
