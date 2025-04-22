'use client';
import {discussion, reply, user} from "@prisma/client";
import { useState } from "react";
import {Card, CardHeader, CardBody, CardFooter, User, Button, Textarea} from "@heroui/react";
import { updateDiscussion } from "@/model/discussions";
import {createReply, updateReply} from "@/model/reply";

type HeadProps = {
    parent: discussion & { creator?: user };
    userId: number;
    handleSubmit: Function;
    handleEditSubmit:Function;
};

export function DiscussionComponent(props: HeadProps) {
    const { parent, userId,handleEditSubmit,handleSubmit} = props;
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(parent.title);
    const [newContent, setNewContent] = useState(parent.content);
    const [replyContent, setReplyContent] = useState("");

    const handleEdit = async () => {
        await updateDiscussion(parent.id, newTitle, newContent);
        handleEditSubmit();
        setIsEditing(false);
    };

    const handleReplySubmit = async () => {
        await createReply(userId,parent.id,replyContent);
        handleSubmit();
        setReplyContent("");
    };

    return (
        <Card  className="w-1/3 text-white bg-grey ">
            <CardHeader className="flex flex-col items-start">
                {isEditing ? (
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="text-2xl font-semibold mt-2 w-full"
                    />
                ) : (
                    <h4 className="text-2xl font-semibold mt-2">{parent.title}</h4>
                )}
                {parent?.creator ? (
                    <User name={parent.creator.username} description={parent.creator.firstName} className="mt-1" />
                ) : (
                    <User name="Unknown User" description="N/a" className="mt-1" />
                )}
            </CardHeader>
            <CardBody>
                {isEditing ? (
                    <Textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="w-full p-2 mt-2 text-sm"
                    />
                ) : (
                    <p className="text-lg">{parent.content}</p>
                )}
            </CardBody>
            <CardFooter className="flex flex-col items-start space-y-2">
                {userId === parent.creatorId && (
                    <Button
                        onPress={() => (isEditing ? handleEdit() : setIsEditing(true))}
                        className="bg-blue-500 text-white p-2 rounded-lg"
                    >
                        {isEditing ? "Save Changes" : "Edit Discussion"}
                    </Button>
                )}
                <Textarea
                    value={replyContent}
                    isClearable
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full p-2 rounded-md  text-white "
                />
                <div className="flex justify-end w-full">
                    <Button onPress={handleReplySubmit} className="bg-blue-500 text-white p-2 rounded-lg ">
                        Submit Reply
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}


type ReplyComponentProps = {
    discussionId: number;
    replyData: reply & { other_reply?: reply[]; creator?: user };
    userId: number;
    handleSubmit: Function;
};

export function ReplyComponent(props: ReplyComponentProps) {
    const { discussionId, replyData, userId, handleSubmit } = props;
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [newReplyContent, setNewReplyContent] = useState(replyData.content);
    const [childReplies] = useState(replyData.other_reply || []);

    const handleReplySubmit = async () => {
        await createReply(userId, discussionId, replyContent, replyData.id);
        setReplyContent("");
        setShowReplyBox(false);
        handleSubmit();
    };

    const handleEditReply = async () => {
        await updateReply(replyData.id, newReplyContent);
        setIsEditing(false);
        handleSubmit();
    };

    return (
        <div className="mt-4 pl-4 border-l-2 border-gray-700 w-full">
            <div className="">
            </div>

            {isEditing ? (
                <div>
                    <Textarea
                        value={newReplyContent}
                        onChange={(e) => setNewReplyContent(e.target.value)}
                        className="w-full p-2 text-sm mt-2 bg-gray-800 text-white"
                    />
                    <Button onPress={handleEditReply} className="bg-blue-500 text-white p-2 rounded-lg mt-2">
                        Save Changes
                    </Button>
                </div>
            ) : (
                <div>
                    {replyData?.creator ? (
                        <User name={replyData.creator.username} description={replyData.creator.firstName} className="mt-1" />
                    ) : (
                        <User name="Unknown User" description="N/a" className="mt-1" />
                    )}
                    <p className="mt-2 text-sm">{replyData.content}</p>
                </div>
            )}

            {replyData.creatorId === userId && !isEditing && (
                <Button onPress={() => setIsEditing(true)} className="text-blue-400 text-xs mt-2 mx-5 justify-end">
                    Edit Reply
                </Button>
            )}

            <Button onPress={() => setShowReplyBox(!showReplyBox)} className="text-blue-400 text-xs mt-2 ">
                Reply
            </Button>

            {showReplyBox && (
                <div className="mt-2">
                    <Textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        className="w-full p-2 text-sm rounded-md bg-gray-800 text-white"
                    />
                    <Button onPress={handleReplySubmit} className="bg-blue-500 text-white p-2 rounded-lg mt-2">
                        Submit Reply
                    </Button>
                </div>
            )}


            <div className="mt-2">
                {childReplies.map((childReply) => (
                    <ReplyComponent
                        key={childReply.id}
                        discussionId={discussionId}
                        replyData={childReply}
                        userId={userId}
                        handleSubmit={handleSubmit}
                    />
                ))}
            </div>
        </div>
    );
}
