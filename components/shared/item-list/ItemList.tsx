"use client"

import { Card } from '@/components/ui/card';
import { useConversation } from '@/hooks/useConversation';
import { cn } from '@/lib/utils';
import React from 'react'

type Props = React.PropsWithChildren<{
    title: string;
    action?: React.ReactNode
}>

const ItemList = ({ children, title, action: Action }: Props) => {
    const { isActive } = useConversation()
    return (
        <Card className={cn('h-full w-full lg:flex-none lg:w-96 p-2', {
            "block": !isActive,
            "lg:block": isActive
        })}>
            <div className='mb-4 flex flex-row items-center justify-between p-2 border-b-2 '>
                <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
                {Action ? Action : null}
            </div>
                <div className='h-full w-full flex flex-col items-center justify-start gap-2'>
                    {children}
                </div>
        </Card>
    )
}

export default ItemList