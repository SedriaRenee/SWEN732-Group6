'use client';
import { FullLocation, getLocationByName } from "@/lib/db";
import { JSX, useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState<FullLocation | null>(null);

  async function searchLocation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const location = await getLocationByName(name);
    setLocation(location);
  }

  let found: JSX.Element = <div/>;
  if (location != null) {
    found = <div>
      <p> {location.name} has been found </p>      
      <p> {location.parentId ? `in ${location.parent?.name}` : "No parent"} </p>
      <p> {location.children.length > 0 ? `${location.children.length} nested locations` : "No nested locations"} </p>

    </div>;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1> Travel Guardian </h1>
        {found}
        <p> Begin by selecting a travel destination </p>
        <form className="flex flex-col gap-4 items-center" onSubmit={searchLocation}>
          <input type="text" placeholder="Location" value={name} onChange={(e) => setName(e.target.value)} className="border text-black border-gray-300 rounded p-2" />
          <input type="submit" value="Search" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" />
        </form>
      </main>
    </div>
  );
}
