import { MessageSquare } from 'lucide-react';
import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
    args: {
        id: v.id("conversations")
    },

    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error('Not authenticated');
        }

        const currentUser = await getUserByClerkId({
            ctx,
            clerkId: identity.subject,
        });

        if (!currentUser) {
            throw new ConvexError('User not found');
        }

        const memberShip = await ctx.db
            .query("conversationMembers")
            .withIndex("by_memberId_conversationId", q =>
                q.eq("memberId", currentUser._id).eq("conversationId", args.id))
            .unique();

        if (!memberShip) {
            throw new ConvexError('User is not a member of the conversation');
        }

        const message = await ctx.db
            .query("messages")
            .withIndex("by_conversationId", q => q.eq("conversationId", args.id))
            .order("desc").collect()

        const messagesWithUsers = await Promise.all(message.map(async message => {
            const messageSender = await ctx.db.get(message.senderId)

            if (!messageSender) {
                throw new ConvexError('User not found');
            }

            return {
                message,
                senderImage: messageSender.imageUrl,
                senderName: messageSender.username,
                isCurrentUser: messageSender._id === currentUser._id

            }
        })
        );

        return messagesWithUsers;
    },
});