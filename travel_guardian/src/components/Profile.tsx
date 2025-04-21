"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Settings } from "lucide-react";

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
import { UserProfile } from "@/model/user";
import { VisitLocation } from "@/model/location";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();

  const effectiveUsername = username || params?.username;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [visited, setVisited] = useState<VisitLocation[]>([]);
  const [wantsToVisit, setWantsToVisit] = useState<VisitLocation[]>([]);

  useEffect(() => {
    if (!username) return;

    fetch(`/api/profile/${username}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProfile({
          ...data,
        });
        const visitedLocations = data.visits.filter(
          (visit: VisitLocation) => visit.past
        );
        const wantToVisitLocations = data.visits.filter(
          (visit: VisitLocation) => !visit.past
        );

        setVisited(visitedLocations);
        setWantsToVisit(wantToVisitLocations);
        console.log(visitedLocations);
      })
      .catch(() => console.error("Error fetching profile"));
  }, [username]);

  const handleEditRedirect = () => {
    router.push(`/profile/${username}/edit`);
  };

  const handleSettingsRedirect = () => {
    router.push(`/profile/${username}/settings`);
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 relative">
      <div className="absolute top-4 right-4">
        <button
          onClick={handleSettingsRedirect}
          className="text-gray-600 hover:text-blue-500 transition"
          aria-label="Settings"
        >
          <Settings size={24} />
        </button>
      </div>

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
        <p>
          <span className="font-bold">About Me:</span>{" "}
          {profile.description || "N/A"}
        </p>
        <p>
          <span className="font-bold">Name:</span> {profile.firstName ?? "N/A"}
        </p>
        <p>
          <span className="font-bold">Age:</span> {profile.age ?? "N/A"}
        </p>
        <p>
          <span className="font-bold">Hometown:</span>{" "}
          {profile.hometown ? profile.hometown.name : "N/A"}
        </p>
        <p>
          <span className="font-bold">Places Visited ({visited.length}): </span>
          {visited.map((visit) => visit.location.name).join(", ")}
        </p>
        <p>
          <span className="font-bold">
            Places to Visit ({wantsToVisit.length}):{" "}
          </span>
          {wantsToVisit.map((visit) => visit.location.name).join(", ")}
        </p>
      </div>
    </div>
  );
}
