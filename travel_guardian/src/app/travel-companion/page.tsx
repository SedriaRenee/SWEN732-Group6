"use client";

import { useEffect, useState } from "react";
import { getAllPosts } from "@/model/companion";
import { companion_post } from "@prisma/client";
import { getSession } from "@/lib/session";
import { Button, Modal, ModalContent } from "@heroui/react";
import CreatePost from "@/components/CreatePost";
import Link from "next/link";
import { getCountries } from "@/model/location";
import { PREFERENCE_TAGS } from "@/model/preferences";

export default function TravelCompanions() {
    const [postList, setPostList] = useState<companion_post[]>([]);
    const [isModOpen, setIsModOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [session, setSession] = useState<any>();
    const [locationFilter, setLocationFilter] = useState("");
    const [tagFilter, setTagFilter] = useState<string[]>([]);
    const [locations, setLocations] = useState([]);
    const [showTagDropdown, setShowTagDropdown] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const posts = await getAllPosts();
                const s = await getSession();
                const l = await getCountries();
                setSession(s);
                setPostList(posts);
                setLocations(l);
            } catch (err) {
                setError("Failed to load posts");
                console.error(err);
            }
        };

        fetchData();
    }, []);

    const toggleTag = (tag: string) => {
        setTagFilter((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const filteredPosts = postList.filter((post) => {
        const matchesLocation =
            locationFilter === "" ||
            post.location?.name.toLowerCase().includes(locationFilter.toLowerCase());

        const matchesTags =
            tagFilter.length === 0 ||
            tagFilter.every((tag) =>
                post.preferences?.some((pref) => pref.toLowerCase().includes(tag.toLowerCase()))
            );




        return matchesLocation && matchesTags ;
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
                        <Modal isOpen={isModOpen} className="bg-[#111111BB]" onClose={()=>setIsModOpen(false)}>
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

            {/* FILTERS */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Location Filter */}
                <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="p-2 bg-gray-800 text-white rounded"
                >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                        <option key={loc.id} value={loc.name}>
                            {loc.name}
                        </option>
                    ))}
                </select>

                {/* Tags Filter Dropdown */}
                <div className="relative w-full md:w-64">
                    <button
                        onClick={() => setShowTagDropdown(!showTagDropdown)}
                        className="w-full bg-gray-800 text-white p-2 rounded"
                    >
                        {tagFilter.length === 0 ? "Select Preferences" : tagFilter.join(", ")}
                    </button>
                    {showTagDropdown && (
                        <div className="absolute z-10 mt-2 w-full bg-gray-900 border border-gray-700 rounded shadow-lg max-h-60 overflow-auto">
                            {PREFERENCE_TAGS.map((tag) => (
                                <label
                                    key={tag}
                                    className="flex items-center px-3 py-2 hover:bg-gray-800 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={tagFilter.includes(tag)}
                                        onChange={() => toggleTag(tag)}
                                        className="mr-2"
                                    />
                                    {tag}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* POSTS */}
            {error ? (
                <div className="p-4 text-red-500">{error}</div>
            ) : filteredPosts.length === 0 ? (
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
                                                {" on "}
                                                {new Date(post.startDate).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                                {post?.endDate && (
                                                    <>
                                                        {" - "}
                                                        {new Date(post.endDate).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
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
