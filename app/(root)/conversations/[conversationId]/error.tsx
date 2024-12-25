"use client"

import ConversationFallback from "@/components/shared/conversation/ConversationFallback"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Error({ error }: { error: Error }) {
    const router = useRouter()

    useEffect(() => {
        setTimeout(() => {
            <div className="flex items-center justify-center">
                <Loader2/>   
            </div>
            router.push('/conversations')
        }, 3000)
    }, [error, router])

    return <ConversationFallback/>
} 