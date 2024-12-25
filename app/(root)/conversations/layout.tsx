"use client"

import ItemList from '@/components/shared/item-list/ItemList'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { Loader2 } from 'lucide-react'
import React from 'react'
import DMconversationItem from './_components/DMconversationItem'
import GroupConversationItem from './_components/GroupConversationItem'
import CreateGroupDialog from './_components/CreateGroupDialog'

// Changed {} to unknown
type Props = React.PropsWithChildren<unknown>

const ConversationsLayout = ({ children }: Props) => {
  const conversations = useQuery(api.conversations.get)
  const isLoading = !conversations;
  const hasConversations = Array.isArray(conversations) && conversations.length > 0;

  return (
    <>
      <ItemList title='Conversations' action={<CreateGroupDialog />}>
        {isLoading ? (
          <Loader2>
            <p>Loading...</p>
          </Loader2>
        ) : hasConversations ? (
          conversations.map((conversation) => (
            !conversation.conversation.isGroup ? (
              <GroupConversationItem
                key={conversation.conversation._id}
                id={conversation.conversation._id}
                name={conversation.conversation.name || ""}
                lastMessageContent={conversation.lastMessage?.content}
                lastMessageSender={conversation.lastMessage?.sender}
                unseenCount={conversation.unSeenCount}
              />
            ) : (
              <DMconversationItem
                key={conversation.conversation._id}
                id={conversation.conversation._id}
                username={conversation.otherMember?.username || ""}
                imageUrl={conversation.otherMember?.imageUrl || ""}
                lastMessageContent={conversation.lastMessage?.content}
                lastMessageSender={conversation.lastMessage?.sender}
                unseenCount={conversation.unSeenCount}
              />
            )
          ))
        ) : (
          <p className='w-full h-full flex items-center justify-center'>
            No Conversation Found
          </p>
        )}
      </ItemList>
      {children}
    </>
  )
}

export default ConversationsLayout;