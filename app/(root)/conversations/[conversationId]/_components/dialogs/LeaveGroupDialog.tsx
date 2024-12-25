"use client"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutationState } from '@/hooks/UseMutationState';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import { ConvexError } from 'convex/values';
import React, { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

type Props = {
    conversationId: Id<"conversations">;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const LeaveGroupDialog = ({ conversationId, open, setOpen }: Props) => {
    const { mutate: leaveGroup, pending } = useMutationState(api.conversation.leave);

    const handleLeaveGroup = async () => {
        leaveGroup({ conversationId })
            .then(() => {
                toast.success("You have left the group successfully");
            }).catch((error) => {
                toast.error(error instanceof ConvexError ? error.data : "Unexpected Error");
            });
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className='bg-white'>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are You Sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. You will not be able to send messages in this group.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='w-full block'>
                    <AlertDialogAction onClick={handleLeaveGroup} disabled={pending} className='w-full flex items-center justify-center'>
                        Leave
                    </AlertDialogAction>
                    <AlertDialogCancel disabled={pending} className='w-full my-3'>
                        <Button className='w-full' variant={"outline"}>
                            Cancel
                        </Button>
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default LeaveGroupDialog;