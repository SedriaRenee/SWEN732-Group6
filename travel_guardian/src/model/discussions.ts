"use server";
import { getPrisma } from "@/lib/db";
import {discussions, report} from "@prisma/client";

export async function getAllDiscussions(locationId:number) {
    const client = await getPrisma();
    return client.discussions.findMany({
        where:{ locationId : locationId }}
    );
}

export async function getDiscussions(discussionId: number){
    const client = await getPrisma();
    return client.discussions.findFirst({where:{id:discussionId}});
}

export async function createDiscussion(title:string,content:string,createrId:number,locationId:number){
    const client = await getPrisma();
    return client.discussions.create({
        data: {
            title: title,
            content: content,
            creatorId: createrId,
            locationId: locationId,
        }
    })
}




export async function updateDiscussion(){}

export async function deleteDiscussion(){}
