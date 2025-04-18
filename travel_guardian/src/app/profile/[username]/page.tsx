"use client";

import Profile from "@/components/Profile"; 
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const params = useParams();
  const username = Array.isArray(params.username) ? params.username[0] : params.username ?? "";
  return (
    <div>
      <Profile username={username} />
    </div>
  );
}