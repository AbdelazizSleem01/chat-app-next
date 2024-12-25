import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { icons, MessageSquare, Users } from "lucide-react"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

export const useNavigation = () => {
    const pathName = usePathname()

    const requestCount = useQuery(api.requests.count)
    const conversation = useQuery(api.conversations.get)

    const unSeenMessageCount = useMemo(()=>{
        return conversation?.reduce((acc ,curr)=>{
            return acc + curr.unSeenCount
        }, 0)
    },[conversation])

    const paths = useMemo(() => [
        {
            name: "Conversations",
            href: "/conversations",
            icon: <MessageSquare
                size="24"
                color="orange"
            />,
            active: pathName.startsWith("/conversations"),
            count: unSeenMessageCount,
        },
        {
            name: "Friends",
            href: "/friends",
            icon: <Users
                size="24"
                color="orange"
            />,
            active: pathName === "/friends",
            count: requestCount
        }
    ], [pathName,requestCount, unSeenMessageCount]);

    return paths;

}