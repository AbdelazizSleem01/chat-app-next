import { Card } from '@/components/ui/card'
import React from 'react'


const ConversationFallback = () => {
    return (
        <Card className='hidden lg:flex h-full w-full p-2 items-center justify-center text bg-secondary text-secondary-foreground  '>
            Select/Start a conversation to get started
        </Card>
    )
}

export default ConversationFallback