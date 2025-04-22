'use server'
import { prisma } from "@/lib/db";
import { companion_post, companion_comment } from "@prisma/client";

type PostWithRelations = companion_post & {
    creator: { id: number; username: string; profilePic?: string | null };
    location: { id: number; name: string };
    _count: { comments: number };
};

type FullPost = PostWithRelations & {
    comments: (companion_comment & {
        creator: { id: number; username: string };
    })[];
};

//Creates a single post
export async function createPost(
    title: string, content: string, startDate: Date | null, endDate: Date | null, userId: number, locId: number, preferences:string[]): Promise<companion_post> {
        return prisma.companion_post.create({
            data: {
                title,
                content,
                startDate,
                endDate,
                creatorId: userId,
                locationId: locId,
                status: "ACTIVE",
                preferences
            }
        });
}

//Gets the Main/Parent post sorted by date posted
export async function getAllPosts(){
    return prisma.companion_post.findMany({
        orderBy: {createdAt: 'desc'},
        include: {
            creator: {
                select: {id: true, username: true, profilePic: true}
            },
            location: {
                select: {id: true, name: true}
            },
            _count: {
                select: {comments: true}
            }
        }
    });
}

//Gets Full post and all compents/replies
export async function getFullPost(postId: number): Promise<FullPost | null>{
    return prisma.companion_post.findUnique({
        where: {id: postId},
        include: {
            creator: {
                select: {id: true, username: true, profilePic: true}
            },
            location: {
                select: {id: true, name: true}
            },
            comments: {
                include: {
                    creator: {
                        select: {id: true, username: true}
                    }
                },
                orderBy: {createdAt: 'asc'}
            }
        }
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
                parentId
            },
            include: {
                creator: {
                    select: {id: true, username: true}
                }
            }
        });
    }
