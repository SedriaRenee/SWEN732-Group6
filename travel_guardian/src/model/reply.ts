"use server";
import { getPrisma } from "@/lib/db";
import {reply} from "@prisma/client";

// Fetch reply history for a discussion or user
export async function getReplyHistory(creatorId: number): Promise<reply[]> {
    const client = await getPrisma();
    return client.reply.findMany({
        where: { creatorId: creatorId },
    });
}

// Create a new reply
export async function createReply(creatorId: number, discussionId: number, content: string, parentId?: number){
    const client = await getPrisma();
    return client.reply.create({
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
    const client = await getPrisma();
    return client.reply.update({
        where: { id: replyId },
        data: { content },
    });
}

// Delete a reply
export async function deleteReply(replyId: number){
    const client = await getPrisma();
    return  client.reply.delete({
        where: { id: replyId },
    });
}
