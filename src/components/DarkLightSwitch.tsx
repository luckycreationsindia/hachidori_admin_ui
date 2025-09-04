"use client"

import {useEffect, useState} from "react";
import {IconMoon, IconSun} from "@tabler/icons-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {IconSwitch} from "@/components/ui/icon-switch";

const DarkLightSwitch = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const root = document.documentElement;
        const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;

        if (storedTheme) {
            setTheme(storedTheme);
            if (storedTheme === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        } else {
            setTheme('light');
            root.classList.add('light');
            localStorage.setItem('theme', 'light');
        }
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <IconSwitch
                        className="border-1 border-gray-200 rounded-full m-2"
                        checked={theme === 'dark'}
                        onCheckedChange={toggleTheme}
                        aria-label="Toggle theme"
                        uncheckedIcon={<IconSun size={16} className="text-yellow-500" />}
                        checkedIcon={<IconMoon size={16} className="text-blue-500" />}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default DarkLightSwitch;