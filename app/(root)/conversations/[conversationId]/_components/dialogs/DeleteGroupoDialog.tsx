"use client"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel'
import { useMutationState } from '@/hooks/UseMutationState';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import { ConvexError } from 'convex/values';
import React, { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner';

type Props = {
    conversationId: Id<"conversations">;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>
}

const DeleteGroupDialog = ({ conversationId, open, setOpen }: Props) => {
    const { mutate: deleteGroup, pending } = useMutationState(api.conversation.remove)

    const handleRemoveGroup = async () => {
        deleteGroup({ conversationId })
            .then(() => {
                toast.success("Group Removed Successfully")
            }).catch((error) => {
                toast.error(error instanceof ConvexError ? error.data : "Unexpected Error")
            })
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className='bg-white'>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are You Sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                        All messages will be deleted and
                        you will not be able to message this group.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='w-full block'>
                    <AlertDialogAction onClick={handleRemoveGroup} disabled={pending} className='w-full flex items-center justify-center'>
                        Delete
                    </AlertDialogAction>
                    <AlertDialogCancel disabled={pending} className='w-full my-3'>
                        <Button className='w-full' variant={"outline"}>
                            Cancel
                        </Button>
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteGroupDialog;