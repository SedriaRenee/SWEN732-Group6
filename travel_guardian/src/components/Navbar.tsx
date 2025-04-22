import { deleteSession, getSession } from "@/lib/session";
import { LocationResult, searchLocation } from "@/model/location";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { JSX, useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [name, setName] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [locations, setLocations] = useState<LocationResult[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [session, setSession] = useState<any>(null);

  // Fetch session once when pathname changes
  useEffect(() => {
    async function fetchSession() {
      const session = await getSession();
      setSession(session);
    }
    fetchSession();
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest(".search-results")) {
        setShowResults(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [locations]);

  async function search(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLastSearch(name);
    const res = await searchLocation(name);
    setLocations(res);
    setShowResults(true);
    setNoResults(res.length === 0);
  }

  async function logout() {
    await deleteSession();
    setSession(null); // Clear session after logout
  }

  let searchResult: JSX.Element = <div />;
  if (locations.length > 0) {
    searchResult = (
      <div
        className="absolute bg-gray-900 top-10 left-0 p-4 rounded-lg shadow-lg"
        style={{ display: showResults ? "block" : "none" }}
      >
        <h5 className="text-bold">
          {locations.length} search results for {lastSearch}:
        </h5>
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="flex flex-col gap-2"
            data-testid="location"
          >
            <a
              className="text-blue-300 text-bold py-1"
              href={`/location/${loc.id}`}
            >
              {loc.name}
              {loc.parentName.length > 0 && `, ${loc.parentName}`} (
              {loc.type.charAt(0).toUpperCase() + loc.type.slice(1)})
            </a>
          </div>
        ))}
      </div>
    );
  } else if (noResults) {
    searchResult = (
      <div
        className="absolute bg-gray-900 top-10 left-0 p-4 rounded-lg shadow-lg"
        style={{ display: showResults ? "block" : "none" }}
      >
        <p className="font-bold text-red">No results found</p>
      </div>
    );
  }

  return (
    <nav className="bg-blue-900 p-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-row gap-16 items-center">
          <Link href="/" className="text-white text-2xl font-bold">
            Travel Guardian
          </Link>
          <Link href="/countries" className="text-blue-300 text-lg font-bold">
            Browse Countries
          </Link>
          <Link href="/travel-companion" className="text-blue-300 text-lg font-bold">
            Browse Travel Companions
          </Link>
        </div>

        <form
          className="flex flex-row gap-4 items-center relative"
          onSubmit={search}
        >
          {searchResult}
          <input
            data-testid="search"
            type="text"
            placeholder="Location..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border text-black border-gray-300 rounded p-2 focus:outline-none w-full"
          />
          <input
            type="submit"
            value="Search"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          />
        </form>

        <div className="flex flex-col items-end">
          {session ? (
            <button
              onClick={logout}
              className="text-white font-bold hover:text-blue-300"
            >
              Sign out
            </button>
          ) : (
            <Link href="/login" className="text-white font-bold">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
