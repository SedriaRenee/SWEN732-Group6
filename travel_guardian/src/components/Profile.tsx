"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface Profile {
  profilePic: string;
  username: string;
  name: string;
  age: number;
  hometown: string;
  placesVisited: string[];
  placesToVisit: string[];
  description: string;
}

interface ProfileProps {
  username?: string;
}

export default function ProfilePage({ username }: ProfileProps) {
  const params = useParams<{ username: string }>();
  const router = useRouter();

  const effectiveUsername = username || params?.username;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (!effectiveUsername) return;

    fetch(`/api/profile/${effectiveUsername}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile({
          ...data,
          placesVisited: Array.isArray(data.placesVisited) ? data.placesVisited : [],
          placesToVisit: Array.isArray(data.placesToVisit) ? data.placesToVisit : [],
        });
      })
      .catch(() => console.error("Error fetching profile"));
  }, [effectiveUsername]);

  const handleEditRedirect = () => {
    router.push(`/profile/${effectiveUsername}/edit`);
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="flex flex-col items-center mt-8">
        <Image
          src={profile.profilePic || "/user.png"}
          alt="Profile Picture"
          width={120}
          height={120}
          className="rounded-full border-4 border-gray-300"
        />
        <h2 className="mt-4 text-2xl font-bold">{profile.username}</h2>
        <button
          onClick={handleEditRedirect}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Edit Profile
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4">Bio</h3>
        <p><span className="font-bold">About Me:</span> {profile.description || "N/A"}</p>
        <p><span className="font-bold">Name:</span> {profile.name || "N/A"}</p>
        <p><span className="font-bold">Age:</span> {profile.age || "N/A"}</p>
        <p><span className="font-bold">Hometown:</span> {profile.hometown || "N/A"}</p>
        <p>
          <span className="font-bold">Places Visited:</span>{" "}
          {profile.placesVisited.length > 0 ? profile.placesVisited.join(", ") : "None"}
        </p>
        <p>
          <span className="font-bold">Places to Visit:</span>{" "}
          {profile.placesToVisit.length > 0 ? profile.placesToVisit.join(", ") : "None"}
        </p>
      </div>
    </div>
  );
}