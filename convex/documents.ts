import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const archive = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existDoc = await ctx.db.get(args.id);

    if (!existDoc) {
      throw new Error("Not found");
    }

    if (existDoc.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const recursiveArchive = async (docId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) => {
          return q.eq("userId", userId).eq("parentDocument", docId);
        })
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });
        await recursiveArchive(child._id);
      }
    };

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    recursiveArchive(args.id);

    return document;
  },
});

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) => {
        return q.eq("userId", userId).eq("parentDocument", args.parentDocument);
      })
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args?.parentDocument,
      userId,
      isArchived: false,
      isPubllished: false,
    });

    return document;
  },
});

export const getTrash = query({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => {
        return q.eq("userId", userId);
      })
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();
    return documents;
  },
});

export const restore = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const existDoc = await ctx.db.get(args.id);

    if (!existDoc) {
      throw new Error("Not found");
    }

    if (existDoc.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const recursiveRestore = async (docId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) => {
          return q.eq("userId", userId).eq("parentDocument", docId);
        })
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, { isArchived: false });

        await recursiveRestore(child._id);
      }
    };

    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };

    if (existDoc.parentDocument) {
      const parent = await ctx.db.get(existDoc.parentDocument);

      if (parent?.isArchived) {
        options.parentDocument = undefined;
      }
    }

    const doc = await ctx.db.patch(args.id, options);

    recursiveRestore(args.id);

    return doc;
  },
});

export const remove = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const existDoc = await ctx.db.get(args.id);

    if (!existDoc) {
      throw new Error("Not found");
    }

    if (existDoc.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.delete(args.id);

    return document;
  },
});
