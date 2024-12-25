


import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const remove = mutation({

    args: {
        conversationId: v.id("conversations"),
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

        const conversation = await ctx.db.get(args.conversationId)

        if (!conversation) {
            throw new ConvexError('conversation not found');

        }

        const memberShips = await ctx.db
            .query("conversationMembers")
            .withIndex("by_conversationId", q => { return q.eq("conversationId", args.conversationId) })
            .collect()

        if (!memberShips || memberShips.length !== 2) {
            throw new ConvexError('Not enough members in the conversation');

        }

        const friendShip = await ctx.db
            .query("friends")
            .withIndex("by_conversationId", q => { return q.eq("conversationId", args.conversationId) })
            .unique();

        if (!friendShip) {
            throw new ConvexError('No friendship found');
        }

        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversationId", q => { return q.eq("conversationId", args.conversationId) })
            .collect()

        await ctx.db.delete(args.conversationId)
        await ctx.db.delete(friendShip._id)

        await Promise.all(memberShips.map(async memberShip => {
            await ctx.db.delete(memberShip._id)

        }))
        await Promise.all(messages.map(async message => {
            await ctx.db.delete(message._id)

        }))





    }
})
