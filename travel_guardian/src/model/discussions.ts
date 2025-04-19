"use server";
import { prisma } from "@/lib/db";
import {discussion} from "@prisma/client";


export async function getAllDiscussions(locationId:number) {
    return prisma.discussion.findMany({
        where:{ locationId : locationId }}
    );
}

export async function getDiscussions(discussionId: number):Promise<discussion |null> {
    return prisma.discussion.findUnique(
        {where:{id:discussionId},
        include:{users:true},
        }
    );
}

export async function createDiscussion(title:string,content:string,creatorId:number,locationId:number){
    return prisma.discussion.create({
        data: {
            title: title,
            content: content,
            creatorId: creatorId,
            locationId: locationId,
        }
    })
}

export async function updateDiscussion(discussionId:number,title:string, content:string){
    return prisma.discussion.update({
        where:{id:discussionId},
       data:{
            title:title,
            content: content,
        }
    })
}

export async function deleteDiscussion(discussionId:number){
    return prisma.discussion.delete({where:{id:discussionId}});
}



