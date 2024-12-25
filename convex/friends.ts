import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";
import { getLastMessageDetails } from "./conversations";



export const get = query({
    args: {},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('Not authenticated');

        const currentUser = await getUserByClerkId({ ctx, clerkId: identity.subject });
        if (!currentUser) throw new ConvexError('User not found');

        const friendShips1 = await ctx.db.query("friends").withIndex("by_user1", (q) => q.eq("user1", currentUser._id)).collect();
        const friendShips2 = await ctx.db.query("friends").withIndex("by_user2", (q) => q.eq("user2", currentUser._id)).collect();
        const friendShips = [...friendShips1, ...friendShips2];

        const friends = await Promise.all(
            friendShips.map(async (friendShip) => {
                const friend = await ctx.db.get(
                    friendShip.user1 === currentUser._id ? friendShip.user2 : friendShip.user1
                );
                if (!friend) throw new ConvexError('Friend not found');
                return friend;
            })
        );
        return friends;
    }
});
