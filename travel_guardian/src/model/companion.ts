"use server";
import { prisma } from "@/lib/db";
import { companion_comment, Prisma } from "@prisma/client";

//Creates a single post
export async function createPost(
  title: string,
  content: string,
  startDate: Date | null,
  endDate: Date | null,
  userId: number,
  locId: number,
  preferences: string[]
) {
  return prisma.companion_post.create({
    data: {
      title,
      content,
      startDate,
      endDate,
      creatorId: userId,
      locationId: locId,
      status: "ACTIVE",
      preferences,
    },
  });
}

//Gets the Main/Parent post sorted by date posted
export async function getAllPosts(): Promise<CompPostLocation[]> {
  return prisma.companion_post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      creator: {
        select: { id: true, username: true, profilePic: true },
      },
      location: {
        select: { id: true, name: true },
      },
      _count: {
        select: { comments: true },
      },
    },
  });
}

//Gets Full post and all compents/replies
export async function getFullPost(postId: number) {
  return prisma.companion_post.findUnique({
    where: { id: postId },
    include: {
      creator: {
        select: { id: true, username: true, profilePic: true },
      },
      location: {
        select: { id: true, name: true },
      },
    },
  });
}

export async function getComments(parentId: number) {
  return prisma.companion_comment.findMany({
    where: {
      postId: parentId,
      parentId: null,
    },
    include: {
      creator: {
        select: {
          id: true,
          username: true,
        },
      },
      replies: {
        include: {
          creator: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
export async function createComment(
  content: string,
  postId: number,
  creatorId: number,
  parentId?: number
): Promise<companion_comment> {
  return prisma.companion_comment.create({
    data: {
      content,
      postId,
      creatorId,
      parentId,
    },
    include: {
      creator: {
        select: { id: true, username: true },
      },
    },
  });
}

export type CompPostLocation = Prisma.companion_postGetPayload<{
  include: {
    creator: {
      select: { id: true; username: true; profilePic: true };
    };
    location: {
      select: { id: true; name: true };
    };
    _count: {
      select: { comments: true };
    };
  };
}>;
