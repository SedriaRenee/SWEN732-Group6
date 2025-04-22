"use client";

import {useEffect, useState} from "react";
import {getAllPosts} from "@/model/companion";
import {companion_post} from "@prisma/client";
import {getSession} from "@/lib/session";
import {Button, Modal, ModalContent} from "@heroui/react";
import CreatePost from "@/components/CreatePost";
import Link from "next/link";

export default function TravelCompanions() {
    const [postList, setPostList] = useState<companion_post[]>([]);
    const [isModOpen, setIsModOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [session, setSession] = useState();
    const [locationFilter, setLocationFilter] = useState("");
    const [tagFilter, setTagFilter] = useState<string[]>([]);
    const [dateFilter, setDateFilter] = useState<Date | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const posts = await getAllPosts();
                const s = await getSession();
                setSession(s);
                setPostList(posts);
                console.log(posts);

            } catch (err) {
                setError("Failed to load posts");
                console.error(err);
            }
        };

        fetchData();
    }, []);
    const filteredPosts = postList.filter((post) => {
        const matchesLocation =
            locationFilter === "" ||
            post.location?.name.toLowerCase().includes(locationFilter.toLowerCase());

        const matchesTags =
            tagFilter.length === 0 ||
            tagFilter.every((tag) =>
                post.preferences?.some((pref) => pref.toLowerCase().includes(tag.toLowerCase()))
            );

        const matchesDate =
            !dateFilter ||
            (post.startDate && new Date(post.startDate).toDateString() === dateFilter.toDateString());

        return matchesLocation && matchesTags && matchesDate;
    });

    const closeModal = async () => {
        setIsModOpen(false);
        const posts = await getAllPosts();
        setPostList(posts);
    };

    return (
        <div className="mx-auto p-4 max-w-4xl min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Travel Companions</h1>

                {session?.userId && (
                    <>
                        <Modal isOpen={isModOpen} className="bg-[#111111BB]">
                            <ModalContent
                                className="fixed bg-[#222222] p-8 rounded-lg shadow-lg"
                                style={{ maxWidth: "600px", margin: "auto" }}
                            >
                                <CreatePost close={closeModal} userId={session.userId} />
                            </ModalContent>
                        </Modal>

                        <Button
                            className="bg-blue-700 hover:bg-blue-900 text-white text-sm p-2 rounded-lg w-32"
                            onPress={() => setIsModOpen(true)}
                        >
                            Create Request
                        </Button>
                    </>
                )}
            </div>

            {error ? (
                <div className="p-4 text-red-500">{error}</div>
            ) : postList.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No posts found</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {filteredPosts.map((post) => (
                        <li key={post.id}>
                            <div className="bg-slate-900 rounded-lg p-4 shadow-md mb-4">
                                <Link href={`/comp_post/${post.id}`}>
                                    <h4 className="text-3xl">{post.title}</h4>
                                    <h4 className="text-xl">
                                        {post?.location.name}
                                        {post?.startDate && (
                                            <>
                                                {' on '}
                                                {new Date(post.startDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                                {post?.endDate && (
                                                    <>
                                                        {' - '}
                                                        {new Date(post.endDate).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </h4>
                                    <p className="text-gray-400">{post.content}</p>
                                </Link>

                                {post.preferences && post.preferences.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {post.preferences.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-800 text-white text-xs px-2 py-1 rounded-full"
                                            >
                      {tag}
                    </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

}
