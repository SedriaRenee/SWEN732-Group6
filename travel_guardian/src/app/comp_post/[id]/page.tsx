"use client";

import {CompHeader, CompReplyComponent} from "@/components/CompanionPost";
import { useEffect, useState } from "react";
import {getComments, getFullPost} from "@/model/companion";
import { getSession } from "@/lib/session";
import type {companion_comment, companion_post} from "@prisma/client";
import { useParams } from "next/navigation"; // Ensure you're using this for URL params



export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = useParams();  // Getting the `id` directly from `useParams()`
    const [post, setPost] = useState<companion_post | null>(null);
    const [session, setSession] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const [comments,setComments] = useState<companion_comment|null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resolvedParams = await params;
                const postId = parseInt(resolvedParams.id);

                if (isNaN(postId)) throw new Error("Invalid post ID");
                const [postData, sessionData] = await Promise.all([
                    getFullPost(postId),
                    getSession()
                ]);
                const com = await getComments(postId);
                setComments(com);
                setPost(postData);
                setSession(sessionData);
            } catch (err) {
                console.error("Failed to load data:", err);
                setError(err instanceof Error ? err.message : "Failed to load data");
            }
        };

        if (id) {
            fetchData();
        }

    }, [id]); // Only depend on `id` here


    if (error) return <div className="text-red-500 p-4">{error}</div>;
    if (!post) return <div className="p-4">Post not found</div>;

    const handleUpdate=async ()=>{
        const newComm = await getComments(post.id);
        setComments(newComm);
    }
    return <div className="flex flex-col gap-4 items-center w-full min-h-screen">
        {session?.userId && <CompHeader userId={session.userId} parent={post} />}
        {comments?.map((c)=><CompReplyComponent key={c.id} discussionId={post.id} replyData={c} userId={session?.userId} handleSumbit={handleUpdate}/>
        )}

    </div>;
}
