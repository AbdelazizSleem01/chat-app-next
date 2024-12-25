"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme/Theme-toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useConversation } from "@/hooks/useConversation";
import { useNavigation } from "@/hooks/useNavegation"
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";


const MobileNav = () => {
    const path = useNavigation();
    const { isActive } = useConversation()

    if (isActive)
        return null;


    return (
        <Card className="fixed bottom-4 w-[calc(100vw-32px)] flex  items-center h-16 p-2 lg:hidden">
            <nav className="w-full">
                <ul className="flex justify-evenly  items-center">
                    {
                        path.map((path, id) => {
                            return (
                                <li key={id} className="relative">
                                    <Link href={path.href}>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Button size={"icon"} variant={path.active ? "default" : "outline"}>
                                                    {path.icon}
                                                </Button>
                                                {
                                                    path.count ?
                                                        <Badge className="absolute left-6 bottom-7 px-2 rounded-xxl border-white">
                                                            {
                                                                path.count
                                                            }
                                                        </Badge> : null
                                                }
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{path.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </Link>
                                </li>
                            )
                        })
                    }
                    <li className="border-2 border-orange-500 rounded-lg">
                        <ThemeToggle/>
                    </li>
                    <li className="border-2 border-orange-500 p-1 flex items-center rounded-full ">
                        <UserButton />
                    </li>
                </ul>
            </nav>

        </Card>
    )
}

export default MobileNav
