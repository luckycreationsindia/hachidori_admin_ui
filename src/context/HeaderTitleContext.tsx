"use client";

import {createContext, useContext, useState, ReactNode} from "react";

interface HeaderTitleContextType {
    title: string;
    setTitle: (title: string) => void;
}

const HeaderTitleContext = createContext<HeaderTitleContextType | undefined>(undefined);

export function HeaderTitleProvider({children}: { children: ReactNode }) {
    const [title, setTitle] = useState(process.env.NEXT_PUBLIC_APP_NAME || "");

    return (
        <HeaderTitleContext.Provider value={{title, setTitle}}>
            {children}
        </HeaderTitleContext.Provider>
    );
}

export function useHeaderTitle() {
    const context = useContext(HeaderTitleContext);
    if (!context) throw new Error("useHeaderTitle must be used within HeaderTitleProvider");
    return context;
}