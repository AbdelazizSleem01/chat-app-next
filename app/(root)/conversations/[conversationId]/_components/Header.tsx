import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DropdownMenuTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { CircleArrowLeft, Settings } from 'lucide-react' // Removed User
import Link from 'next/link'
import React from 'react'

type Props = {
    imageUrl?: string,
    name: string,
    options?: {
        label: string,
        destructive: boolean,
        onClick: () => void
    }[]
}

const Header = ({ imageUrl, name, options }: Props) => {
    return (
        <div className='flex'>
            <Card className='w-full relative flex items-center justify-between p-2 rounded-lg'>
                <div className='flex items-center gap-2'>
                    <Link href={"/conversations"} className='block lg:hidden'>
                        <CircleArrowLeft />
                    </Link>
                    <Avatar className='h-9 w-9'>
                        <AvatarImage src={imageUrl} alt='avatar' />
                        <AvatarFallback>
                            {name.substring(0, 1)}
                        </AvatarFallback>
                    </Avatar>
                    <h3 className='font-semibold'>
                        {name}
                    </h3>
                    <div className='absolute right-2 gap-2'>
                        {options ?
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button size={"icon"} variant={"secondary"}>
                                        <Settings />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {options.map((option, id) => {
                                        return (
                                            <DropdownMenuItem
                                                key={id}
                                                onClick={option.onClick}
                                                className={cn("font-semibold", { "text-destructive": option.destructive })}
                                            >
                                                {option.label}
                                            </DropdownMenuItem>
                                        )
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            : null
                        }
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default Header;