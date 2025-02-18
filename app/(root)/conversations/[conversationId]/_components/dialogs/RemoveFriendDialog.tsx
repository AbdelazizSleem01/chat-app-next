"use client"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
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

const RemoveFriendDialog = ({ conversationId, open, setOpen }: Props) => {
  const { mutate: removeFriend, pending } = useMutationState(api.friend.remove);

  const handleRemoveFriend = async () => {
    removeFriend({ conversationId })
      .then(() => {
        toast.success("Friend Removed Successfully");
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
            This action cannot be undone. All messages will be deleted, and you will not be able to message this user. All group chats will still work as normal.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleRemoveFriend} disabled={pending}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default RemoveFriendDialog;