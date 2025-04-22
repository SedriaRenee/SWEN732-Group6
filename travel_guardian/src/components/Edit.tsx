"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { UserProfile } from "@/model/user";
import { VisitLocation } from "@/model/location";

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

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState<UserProfile>({} as UserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [visited, setVisited] = useState<VisitLocation[]>([]);
  const [wantsToVisit, setWantsToVisit] = useState<VisitLocation[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem(`profile-${username}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setProfile(parsed);
    }

    fetch(`/api/profile/${username}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.age == null) {
          data.age = 0;
        }
        setProfile(data);
        const visitedLocations = data.visits.filter(
          (visit: VisitLocation) => visit.past
        );
        const wantToVisitLocations = data.visits.filter(
          (visit: VisitLocation) => !visit.past
        );

        setVisited(visitedLocations);
        setWantsToVisit(wantToVisitLocations);
      })
      // .then((data) => {  // tmp sol. remove later?
      //   setProfile({
      //     ...data,
      //     description: data.description ?? "",
      //     name: data.name ?? "",
      //    hometown: data.hometown ?? "",
      //     age: data.age ?? 0,
      //    placesVisited: data.placesVisited ?? [],
      //    placesToVisit: data.placesToVisit ?? [],
      //   });
      //   setPlacesVisitedInput((data.placesVisited ?? []).join(", "));
      //   setPlacesToVisitInput((data.placesToVisit ?? []).join(", "));
      // })
      .catch(() => console.error("Error fetching profile"));
  }, [username]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
    };

    const formData = new FormData();
    if (selectedFile) {
      formData.append("profilePic", selectedFile);
    }
    formData.append("username", profile.username);
    formData.append("name", profile.firstName);
    formData.append("age", profile.age ? profile.age.toString() : "");
    //formData.append("hometown", profile.hometown?.name!!);
    formData.append("description", profile.description ?? "");
    // formData.append("placesVisited", (profile.placesVisited ?? []).join(", "));
    // formData.append("placesToVisit", (profile.placesToVisit ?? []).join(", "));

    try {
      await fetch(`/api/profile/update`, {
        method: "POST",
        body: formData,
      });
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }

    sessionStorage.setItem(
      `profile-${username}`,
      JSON.stringify(updatedProfile)
    );
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="flex flex-col items-center mt-8">
        <Image
          src={previewImage || profile.profilePic || "/user.png"}
          alt="Profile Picture"
          width={120}
          height={120}
          className="rounded-full border-4 border-gray-300"
        />
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />
        )}

        <h2 className="mt-4 text-2xl font-bold">{profile.username}</h2>

        <button
          onClick={isEditing ? handleSave : handleEditToggle}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          {isEditing ? "Save" : "Edit Profile"}
        </button>
      </div>

      {isEditing ? (
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
          <h3 className="text-xl font-semibold mb-4">Edit Bio</h3>

          <input
            type="text"
            value={profile.description ?? ""}
            onChange={(e) =>
              setProfile({ ...profile, description: e.target.value })
            }
            className="w-full mb-4 p-2 border rounded-lg"
            placeholder="About me"
          />

          <input
            type="text"
            value={profile.firstName ?? ""}
            onChange={(e) =>
              setProfile({ ...profile, firstName: e.target.value })
            }
            className="w-full mb-4 p-2 border rounded-lg"
            placeholder="Name"
          />

          <input
            type="number"
            value={Number(profile.age)}
            onChange={(e) =>
              setProfile({ ...profile, age: Number(e.target.value) })
            }
            className="w-full mb-4 p-2 border rounded-lg"
            placeholder="Age"
          />

          <input
            type="text"
            value={profile.hometown ? profile.hometown?.name!! : ""}
            readOnly={true}
            className="w-full mb-4 p-2 border rounded-lg"
            placeholder="Hometown"
          />

          <input
            type="text"
            value={visited.length}
            readOnly={true}
            className="w-full mb-4 p-2 border rounded-lg"
            placeholder="Places Visited"
          />

          <input
            type="text"
            value={wantsToVisit.length}
            readOnly={true}
            className="w-full mb-4 p-2 border rounded-lg"
            placeholder="Places to Visit"
          />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
          <h3 className="text-xl font-semibold mb-4">Bio</h3>
          <p>
            <span className="font-bold">About Me:</span>{" "}
            {profile.description || "N/A"}
          </p>
          <p>
            <span className="font-bold">Name:</span> {profile.firstName || "N/A"}
          </p>
          <p>
            <span className="font-bold">Age:</span> {profile.age == 0 ? "N/A" : profile.age}
          </p>
          <p>
            <span className="font-bold">Hometown:</span>{" "}
            {profile.hometown?.name!! || "N/A"}
          </p>
          <p>
            <span className="font-bold">
              Places Visited ({visited.length}):{" "}
            </span>
            {visited.map((visit) => visit.location.name).join(", ")}
          </p>
          <p>
            <span className="font-bold">
              Places to Visit ({wantsToVisit.length}):{" "}
            </span>
            {wantsToVisit.map((visit) => visit.location.name).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
