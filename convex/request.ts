import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const create = mutation({
    args: {
        email: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError('Not authenticated');
        }

        if (args.email === identity.email) {
            throw new ConvexError('Cannot update own email');
        }

        const currentUser = await getUserByClerkId({
            ctx, clerkId: identity.subject,
        });

        if (!currentUser) {
            throw new ConvexError('User not found');
        }

        // Get users by email
        const receivers = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .collect();

        if (receivers.length === 0) {
            throw new ConvexError('User with this email does not exist');
        }

        const receiver = receivers[0];

        if (receivers.length > 1) {
            console.warn(`Multiple users found with email ${args.email}. Using first user.`);
        }

        // Check if request already sent
        const requestAlreadySent = await ctx.db
            .query("requests")
            .withIndex("by_receiver_sender", (q) => q
                .eq("sender", currentUser._id)
                .eq("receiver", receiver._id)
            ).collect();

        if (requestAlreadySent.length > 0) {
            throw new ConvexError('Request already sent');
        }

        // Check if request already received
        const requestAlreadyReceived = await ctx.db
            .query("requests")
            .withIndex("by_receiver_sender", (q) => q
                .eq("sender", receiver._id)
                .eq("receiver", currentUser._id)
            ).collect();

        if (requestAlreadyReceived.length > 0) {
            throw new ConvexError('Request already received');
        }

        const friends1 = await ctx.db.query("friends")
            .withIndex("by_user1", (q) => q.eq
                ("user1", currentUser._id))
            .collect();

        const friends2 = await ctx.db.query("friends")
            .withIndex("by_user2", (q) => q.eq
                ("user2", currentUser._id))
            .collect();

            if (friends1.some(friend => friend.user2 === receiver._id) ||
                friends2.some(friend => friend.user1 === receiver._id)) {
            throw new ConvexError('User is already a friend');
        }

        // Insert the new request
        const request = await ctx.db.insert("requests", {
            sender: currentUser._id,
            receiver: receiver._id,
        });

        return request;
    },
});

export const deny = mutation({
    args: {
        id: v.id("requests"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError('Not authenticated');
        }

        const currentUser = await getUserByClerkId({
            ctx, clerkId: identity.subject,
        });

        if (!currentUser) {
            throw new ConvexError('User not found');
        }

        const request = await ctx.db.get(args.id);
        if (!request || request.receiver !== currentUser._id) {
            throw new ConvexError('Request not found');
        }

    await ctx.db.delete(request._id);
    },
});


export const accept = mutation({
    args: {
        id: v.id("requests"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError('Not authenticated');
        }
        const currentUser = await getUserByClerkId({
            ctx, clerkId: identity.subject,
        });
        if (!currentUser) {
            throw new ConvexError('User not found');
        }
        const request = await ctx.db.get(args.id);
        if (!request || request.receiver !== currentUser._id) {
            throw new ConvexError('Request not found');
        }

        const conversationId = await ctx.db.insert("conversations",{
            isGroup:false
        });

        await ctx.db.insert("friends", {
            user1: currentUser._id,
            user2: request.sender,
            conversationId,
        });

        await ctx.db.insert("conversationMembers", {
            memberId: currentUser._id,
            conversationId,
        });
        await ctx.db.insert("conversationMembers", {
            memberId: request.sender,
            conversationId,
        });
        await ctx.db.delete(request._id);
    }
})
