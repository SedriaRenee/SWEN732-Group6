"use server";
import { prisma } from "@/lib/db";
import {discussions} from "@prisma/client";


export async function getAllDiscussions(locationId:number) {
    return prisma.discussions.findMany({
        where:{ locationId : locationId }}
    );
}

export async function getDiscussions(discussionId: number):Promise<discussions |null> {
    return prisma.discussions.findUnique(
        {where:{id:discussionId},
        include:{users:true},
        }
    );
}

export async function createDiscussion(title:string,content:string,creatorId:number,locationId:number){
    return prisma.discussions.create({
        data: {
            title: title,
            content: content,
            creatorId: creatorId,
            locationId: locationId,
        }
    })
}

export async function updateDiscussion(discussionId:number,title:string, content:string){
    return prisma.discussions.update({
        where:{id:discussionId},
       data:{
            title:title,
            content: content,
        }
    })
}

export async function deleteDiscussion(discussionId:number){
    return prisma.discussions.delete({where:{id:discussionId}});
}



