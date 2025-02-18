"use client"
import ConversationContainer from '@/components/shared/conversation/ConversationContainer'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import Header from './_components/Header'
import Body from './_components/Body/Body'
import ChatInput from './_components/Input/ChatInput'
import RemoveFriendDialog from './_components/dialogs/RemoveFriendDialog'
import DeleteGroupDialog from './_components/dialogs/DeleteGroupoDialog'
import LeaveGroupDialog from './_components/dialogs/LeaveGroupDialog'

// Adjusted Props to handle the promise correctly
type Props = {
  params: Promise<{
    conversationId: Id<"conversations">
  }>
}

const ConversationPage = ({ params }: Props) => {
  // Unwrap the promise before using the params
  const { conversationId } = React.use(params);

  const conversation = useQuery(api.conversation.get, { id: conversationId });

  const [removeFriendDialogOpen, setRemoveFriendDialogOpen] = useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false);

  return conversation === undefined ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="h-8 w-8" />
    </div>
  ) : conversation === null ? (
    <p className="w-full h-full flex items-center justify-center">
      Conversation Not Found!☹️
    </p>
  ) : (
    <ConversationContainer>
      <RemoveFriendDialog
        conversationId={conversationId}
        open={removeFriendDialogOpen}
        setOpen={setRemoveFriendDialogOpen}
      />
      <DeleteGroupDialog
        conversationId={conversationId}
        open={deleteGroupDialogOpen}
        setOpen={setDeleteGroupDialogOpen}
      />
      <LeaveGroupDialog
        conversationId={conversationId}
        open={leaveGroupDialogOpen}
        setOpen={setLeaveGroupDialogOpen}
      />
      <Header
        imageUrl={conversation.isGroup ? undefined : conversation.otherMember?.imageUrl}
        name={conversation.isGroup ? conversation.name || "Unknown Group" : conversation.otherMember?.username || "Unknown User"}
        options={
          conversation.isGroup
            ? [
                {
                  label: "Leave Group",
                  destructive: false,
                  onClick: () => setLeaveGroupDialogOpen(true),
                },
                {
                  label: "Delete Group",
                  destructive: true,
                  onClick: () => setDeleteGroupDialogOpen(true),
                },
              ]
            : [
                {
                  label: "Remove Friend",
                  destructive: true,
                  onClick: () => setRemoveFriendDialogOpen(true),
                },
              ]
        }
      />
      <Body
        members={
          conversation.isGroup
            ? conversation.otherMembers?.map((member) => ({
                ...member,
                username: member.username || "Unknown User", // Provide fallback value
              })) || []
            : conversation.otherMember
            ? [
                {
                  ...conversation.otherMember,
                  username: conversation.otherMember.username || "Unknown User", // Provide fallback value
                },
              ]
            : []
        }
      />
      <ChatInput />
    </ConversationContainer>
  );
};

export default ConversationPage;
