"use client"

import {useHeaderTitle} from "@/context/HeaderTitleContext";
import {useEffect} from "react";

const Dashboard = () => {
    const { setTitle } = useHeaderTitle();

    useEffect(() => {
        setTitle("Dashboard");
        return () => setTitle(process.env.NEXT_PUBLIC_APP_NAME || "");
    }, [setTitle]);

    return (
        <div className="flex flex-1 items-center justify-center">
            <span className="text-2xl font-bold">Dashboard</span>
        </div>
    )
}

export default Dashboard