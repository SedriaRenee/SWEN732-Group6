import {companion_comment, companion_post, discussion, reply, user} from "@prisma/client";
import { useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    User,
    Button,
    Textarea,
} from "@heroui/react";
import {createComment} from "@/model/companion";
import {createReply, updateReply} from "@/model/reply";
import Func = jest.Func;

type HeadProps = {
    parent: companion_post & { creator?: user };
    userId: number;
};

export function CompHeader({
                                        parent,
                                        userId,
                                    }: HeadProps) {
    const [replyContent, setReplyContent] = useState("");

    const handleReplySubmit = async () => {
        await createComment(replyContent,parent.id,userId);

        setReplyContent("");
    };

    return (
        <Card className="w-full bg-gray-900 text-white shadow-md rounded-xl">
            <CardHeader className="flex flex-col items-start space-y-2">
                <h4 className="text-2xl font-bold">{parent.title}</h4>
                <div className="text-xl">
                    {parent.location?.name}
                    {parent.startDate && (
                        <>
                            {" on "}
                            {new Date(parent.startDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                            {parent.endDate && (
                                <>
                                    {" - "}
                                    {new Date(parent.endDate).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </>
                            )}
                        </>
                    )}
                </div>

                {parent.preferences?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {parent.preferences.map((tag, index) => (
                            <span
                                key={index}
                                className="bg-blue-800 text-white text-xs px-2 py-1 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
                <User
                    name={parent?.creator?.username || "Unknown User"}
                    className="text-sm"
                />
            </CardHeader>

            <CardBody>
                <p className="text-base">{parent.content}</p>
            </CardBody>

            <CardFooter className="flex flex-col space-y-4 items-start">
                <Textarea
                    value={replyContent}
                    isClearable
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full bg-gray-800 text-white"
                />
                <div className="flex justify-end w-full">
                    <Button
                        onPress={handleReplySubmit}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
                    >
                        Submit Reply
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

type CompReplyComponentProps = {
    discussionId: number;
    replyData: companion_comment & { replies?:companion_comment ,creator?: user };
    userId: number;
    handleSubmit: Function;
};

export function CompReplyComponent(props: CompReplyComponentProps) {
    const { discussionId, replyData, userId, handleSubmit, } = props;
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    const [childReplies] = useState(replyData.replies || []);

    const handleReplySubmit = async () => {
        await createComment(replyContent,discussionId,props.userId,props.replyData.id);
        setReplyContent("");
        setShowReplyBox(false);
        handleSubmit();
    };



    return (
        <div className="mt-4 pl-4 border-l-2 border-gray-700 w-full">
            <div className="">
            </div>
                <div>

                    {replyData?.creator ? (
                        <User name={replyData.creator.username} description={replyData.creator.firstName} className="mt-1" />
                    ) : (
                        <User name="Unknown User" description="N/a" className="mt-1" />
                    )}
                    <p className="mt-2 text-sm">{replyData.content}</p>
                </div>
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
                    <CompReplyComponent
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
