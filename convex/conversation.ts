import { clsx } from 'clsx';
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
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

        const conversation = await ctx.db.get(args.id);

        if (!conversation) {
            throw new ConvexError('Conversation not found');
        }

        const memberShip = await ctx.db
            .query("conversationMembers")
            .withIndex("by_memberId_conversationId", q =>
                q.eq("memberId", currentUser._id).eq("conversationId", conversation._id))
            .unique();

        if (!memberShip) {
            throw new ConvexError('User is not a member of the conversation');
        }

        const allConversationMemberShip = await ctx.db
            .query("conversationMembers")
            .withIndex("by_conversationId", q => q.eq("conversationId", args.id))
            .collect();

        if (!conversation.isGroup) {
            const otherMemberShip = allConversationMemberShip.filter(memberShip => memberShip.memberId !== currentUser._id)[0];

            const otherMemberDetails = await ctx.db.get(otherMemberShip.memberId);

            return {
                ...conversation,
                otherMember: {
                    ...otherMemberDetails,
                    lastSeenMessageId: otherMemberShip.lastSeenMessageId
                },
                otherMembers: null
            };
        } else {
            const otherMembers = await Promise.all(
                allConversationMemberShip
                    .filter(memberShip => memberShip.memberId !== currentUser._id)
                    .map(async memberShip => {
                        const member = await ctx.db.get(memberShip.memberId);
                        if (!member) {
                            throw new ConvexError('Not Found members');
                        }
                        return {
                            _id: member._id,
                            username: member.username,
                        };
                    })
            );

            return { ...conversation, otherMembers, otherMember: null };
        }
    },
});


export const createGroup = mutation({
    args: {
        members: v.array(v.id("users")),
        name: v.string()
    },

    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error('Not authenticated');
        }

        const currentUser = await getUserByClerkId({
            ctx, clerkId: identity.subject,
        });

        if (!currentUser) {
            throw new ConvexError('User not found');
        }

        const conversationId = await ctx.db.insert("conversations", {
            isGroup: true,
            name: args.name
        })

        await Promise.all([...args.members, currentUser._id].map(async (memberId) => {
            await ctx.db
                .insert("conversationMembers", { memberId, conversationId })
        }))
    }
})


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

        if (!memberShips || memberShips.length <= 1) {
            throw new ConvexError('Not enough members in the conversation');

        }



        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversationId", q => { return q.eq("conversationId", args.conversationId) })
            .collect()

        await ctx.db.delete(args.conversationId)

        await Promise.all(memberShips.map(async memberShip => {
            await ctx.db.delete(memberShip._id)

        }))
        await Promise.all(messages.map(async message => {
            await ctx.db.delete(message._id)

        }))





    }
})


export const leave = mutation({

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

        const memberShip = await ctx.db
            .query("conversationMembers")
            .withIndex("by_memberId_conversationId", q => { return q.eq("memberId", currentUser._id).eq("conversationId", args.conversationId) })
            .unique()

        if (!memberShip) {
            throw new ConvexError('Now you are not member in group');

        }

        await ctx.db.delete(memberShip._id)
    }
})

export const markRead = mutation({
    args: {
      conversationId: v.id("conversations"),
      messageId: v.id("messages"),
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
          q.eq("memberId", currentUser._id).eq("conversationId", args.conversationId)
        )
        .unique();
  
      if (!memberShip) {
        throw new ConvexError('Now you are not a member in the group');
      }
  
      const lastMessage = await ctx.db.get(args.messageId);
  
      await ctx.db.patch(memberShip._id, {
        lastSeenMessageId: lastMessage ? lastMessage._id : undefined
      });
    }
  });