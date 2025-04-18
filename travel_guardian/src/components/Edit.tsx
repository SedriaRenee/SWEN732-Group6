"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetch(`/api/profile/${username}`)
      .then((res) => res.json())
      .then((data) => setProfile(data))
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

    const formData = new FormData();
    if (selectedFile) {
      formData.append("profilePic", selectedFile);
    }
    formData.append("username", profile.username);
    formData.append("name", profile.name);
    formData.append("age", profile.age.toString());
    formData.append("hometown", profile.hometown);
    formData.append("description", profile.description);
    formData.append("placesVisited", (profile.placesVisited ?? []).join(", "));
    formData.append("placesToVisit", (profile.placesToVisit ?? []).join(", "));

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
            value={profile.description}
            onChange={(e) =>
              setProfile({ ...profile, description: e.target.value })
            }
            className="w-full mb-4 p-2 border rounded-lg"
            placeholder="About me"
          />

          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full mb-4 p-2 border rounded-lg"
            placeholder="Name"
          />

          <input
            type="number"
            value={profile.age}
            onChange={(e) =>
              setProfile({ ...profile, age: Number(e.target.value) })
            }
            className="w-full mb-4 p-2 border rounded-lg"
            placeholder="Age"
          />

          <input
            type="text"
            value={profile.hometown}
            onChange={(e) =>
              setProfile({ ...profile, hometown: e.target.value })
            }
            className="w-full mb-4 p-2 border rounded-lg"
            placeholder="Hometown"
          />

          <input
            type="text"
            value={(profile.placesVisited ?? []).join(", ")}
            onChange={(e) =>
              setProfile({
                ...profile,
                placesVisited: e.target.value
                  .split(",")
                  .map((place) => place.trim()),
              })
            }
            className="w-full mb-4 p-2 border rounded-lg"
            placeholder="Places Visited"
          />

          <input
            type="text"
            value={(profile.placesToVisit ?? []).join(", ")}
            onChange={(e) =>
              setProfile({
                ...profile,
                placesToVisit: e.target.value
                  .split(",")
                  .map((place) => place.trim()),
              })
            }
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
            <span className="font-bold">Name:</span> {profile.name || "N/A"}
          </p>
          <p>
            <span className="font-bold">Age:</span> {profile.age || "N/A"}
          </p>
          <p>
            <span className="font-bold">Hometown:</span>{" "}
            {profile.hometown || "N/A"}
          </p>
          <p>
            <span className="font-bold">Places Visited:</span>{" "}
            {(profile.placesVisited ?? []).join(", ") || "None"}
          </p>
          <p>
            <span className="font-bold">Places to Visit:</span>{" "}
            {(profile.placesToVisit ?? []).join(", ") || "None"}
          </p>
        </div>
      )}
    </div>
  );
}
