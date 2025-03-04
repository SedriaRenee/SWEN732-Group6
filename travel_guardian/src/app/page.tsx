'use client';
import { searchLocation, LocationResult } from "@/model/location";
import { JSX, useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [locations, setLocations] = useState<LocationResult[]>([]);
  const [noResults, setNoResults] = useState(false);

  async function search(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLastSearch(name);
    setName("");
    const res = await searchLocation(name);
    setLocations(res);
    setNoResults(res.length == 0);
  }

  let searchResult: JSX.Element = <div/>;
  if (locations.length > 0) {
    searchResult = <div>
      <h5 className="text-2xl text-bold">{locations.length} search results for {lastSearch}: </h5>
      {locations.map((loc) => {
        return <div key={loc.id} className="flex flex-col gap-2">
          <a className="text-blue-500 text-bold" href={`/location/${loc.id}`}>{loc.name}{loc.parentName.length > 0 && `, ${loc.parentName}`} ({loc.type.charAt(0).toUpperCase() + loc.type.slice(1)})</a>
        </div>
      })}
    </div>;
  } else if (noResults) {
    searchResult = <div> Location couldn't be found :{"("} </div>
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start justify-items-center">
        <h1 className="text-white text-2xl text-bold"> Welcome to Travel Guardian! </h1>
        <p className="text-white text-xl"> Find up-to-date travel guidelines for any city in the world! </p>

        <div className="text-center flex flex-col w-full">
          <a className="text-blue-500 text-bold text-2xl p-0" href="/countries">Browse countries</a>
          <p className="text-xl font-black p-0">OR</p>
          <p className="text-white text-2xl text-bold p-0"> Search for your travel destination </p>
        </div>

        {searchResult}
        <form className="flex flex-col gap-4 items-center w-full" onSubmit={search}>
          <input type="text" placeholder="Location" value={name} onChange={(e) => setName(e.target.value)} className="border text-black border-gray-300 rounded p-2 focus:outline-none w-full" />
          <input type="submit" value="Search" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" />
        </form>
      </main>
    </div>
  );
}
