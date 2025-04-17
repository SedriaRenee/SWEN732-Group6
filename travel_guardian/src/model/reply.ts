"use server";
import prisma from "@/lib/db";
import {reply} from "@prisma/client";

export async function getReplyHeads(discussionId: number): Promise<reply[]> {
    return prisma.reply.findMany({
        orderBy:{ created_at:'desc'},
        where: {
            discussionId: discussionId,
            parentId: null,
        },
        include: {
            users: true,
            other_reply: {
                include: {
                    users: true,
                }
            }
        }
    });
}


// Create a new reply
export async function createReply(creatorId: number, discussionId: number, content: string, parentId?: number){
    return prisma.reply.create({
        data: {
            content:content,
            creatorId: creatorId,
             discussionId:discussionId,
             parentId: parentId,
        },
    });
}

// Update a reply
export async function updateReply(replyId: number, content: string){
    return prisma.reply.update({
        where: { id: replyId },
        data: { content:content },
    });
}

// Delete a reply
export async function deleteReply(replyId: number){
    return prisma.reply.delete({
        where: { id: replyId },
    });
}
