"use client"
import { Card } from '@/components/ui/card'
import React from 'react'
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const ConversationFallback = () => {
    const data = useQuery(api.conversations.get);

    if (!data) return <div>Loading...</div>;
    return (
        <Card className='hidden lg:flex h-full w-full p-2 items-center justify-center text bg-secondary text-secondary-foreground  '>
            Select/Start a conversation to get started
        </Card>
    )
}

export default ConversationFallback