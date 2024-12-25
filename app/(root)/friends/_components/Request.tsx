import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel'
import { useMutationState } from '@/hooks/UseMutationState';
import { ConvexError } from 'convex/values';
import { Check, User, X } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

type Props = {
    id: Id<"requests">;
    imageUrl: string;
    email: string;
    username: string;
}

const Request = ({ id, imageUrl, email, username }: Props) => {

    const { mutate: denyRequest, pending: denyPending } = useMutationState(api.request.deny)
    const { mutate: acceptRequest, pending: acceptPending } = useMutationState(api.request.accept)



    return (
        <Card className='w-full p-2 flex flex-row item-center justify-between gap-2'>
            <div className='flex item-center gap-4 truncate'>
                <Avatar>
                    <AvatarImage src={imageUrl} alt='avatar' />
                    <AvatarFallback>
                        <User />
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col truncate">
                    <h4 className='truncate'>
                        {username}
                    </h4>
                    <p className='text-xs text-muted-foreground truncate'>
                        {email}
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    <Button
                        size={"icon"}
                        disabled={denyPending || acceptPending}
                        onClick={() => {
                            acceptRequest({ id })
                                .then(() => { toast.success("Friend Request Accepted") })
                                .catch((error) => {
                                    toast.error(error instanceof ConvexError ? error.data : "Failed to deny friend request")
                                    console.error(error)
                                });
                        }}>
                        <Check />
                    </Button>

                    <Button
                        size={"icon"}
                        disabled={denyPending || acceptPending}
                        variant={"destructive"}
                        onClick={() => {
                            denyRequest({ id })
                                .then(() => { toast.success("Friend Request Denied") })
                                .catch((error) => {
                                    toast.error(error instanceof ConvexError ? error.data : "Failed to deny friend request")
                                    console.error(error)
                                });
                        }}>
                        <X />
                    </Button>
                </div>
            </div>
        </Card>
    )
}

export default Request