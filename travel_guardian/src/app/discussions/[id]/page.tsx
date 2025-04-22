'use client';

import { getDiscussions } from "@/model/discussions";
import { DiscussionComponent, ReplyComponent } from "@/components/DiscussionComponents";
import { getReplyHeads } from "@/model/reply";
import { useEffect, useState } from "react";
import { discussion, reply } from "@prisma/client";
import {Divider} from "@heroui/react";
import {getSession} from "@/lib/session";

export default function Discussion({ params }: { params: Promise<{ id: string }> }) {
    const [discussion, setDiscussion] = useState<discussion | null>(null);
    const [replies, setReplies] = useState<reply[]>([]);
    const [loading, setLoading] = useState(true);
  const [userId,setUser] = useState<number>(null);
    const [discId, setDiscId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const uId = parseInt(await getSession()?.userId);
                setUser(uId);
                const resolvedParams = await params;
                const id = parseInt(resolvedParams.id);
                setDiscId(id);

                const discData = await getDiscussions(id);
                setDiscussion(discData);

                const repliesData = await getReplyHeads(id);
                setReplies(repliesData);
                console.log(repliesData);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params]);

    if (loading) {
        return (
            <div className="flex flex-col gap-4 items-center min-h-screen">
                <h1>Loading...</h1>
            </div>
        );
    }

    if ( !discussion) {
        return (
            <div className="flex flex-col gap-4 items-center min-h-screen">
                <h1 className="text-red text-bold">Discussion not found</h1>
            </div>
        );
    }

    const handleReplySubmit = async () => {
        const updatedReplies = await getReplyHeads(discId!);
        setReplies(updatedReplies);
    };
    const handleEditSubmit = async () => {
        const updatedDisc = await getDiscussions(discId!);
        setDiscussion(updatedDisc);
    };


    return (
        <div className="flex flex-col gap-4 items-center w-full min-h-screen">
            <DiscussionComponent parent={discussion} userId={userId}  handleEditSubmit={handleEditSubmit} handleSubmit={handleReplySubmit} />
            <Divider className="bg-white w-1/3"/>
            <div className="flex flex-col gap-4 w-1/3">
                {replies.length > 0 ? (
                    replies.map((reply) => (
                        <ReplyComponent
                            key={reply.id}
                            discussionId={discussion.id}
                            replyData={reply}
                            userId={userId}
                            handleSubmit={handleReplySubmit}
                        />
                    ))
                ) : (
                    <div>
                        <h1 className="text-red text-bold items-start">No Replies yet</h1>
                    </div>
                )}
            </div>
        </div>
    );
}
