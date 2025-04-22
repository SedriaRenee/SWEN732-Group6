"use client";

import { deleteSession } from "@/lib/session";
import { LocationResult, searchLocation } from "@/model/location";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { JSX, useEffect, useState } from "react";
import { MessageCircle, User } from "lucide-react"; // Import the User icon

export default function Navbar() {
  const pathname = usePathname();
  const [name, setName] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [locations, setLocations] = useState<LocationResult[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [session, setSession] = useState<any>(null);

  const [messageCount, setMessageCount] = useState<number>(0);

  // Fetch session once when pathname changes
  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => setSession(data));
  }, [pathname]);

  // Fetch dynamic message count on mount (or you could re-run when a new message arrives)
  useEffect(() => {
    async function loadMessageCount() {
      try {
        // 1. Fetch conversations
        const convs = await fetch("/api/conversations").then(r => r.json());
        // 2. For each conversation, fetch messages and count
        const counts = await Promise.all(
          convs.map((c: { id: number }) =>
            fetch(`/api/conversations/${c.id}/messages`)
              .then(r => r.json())
              .then((msgs: any[]) => msgs.length)
          )
        );
        // 3. Sum them up
        setMessageCount(counts.reduce((sum, n) => sum + n, 0));
      } catch (err) {
        console.error("Failed to load message count", err);
      }
    }
    loadMessageCount();
  }, []);

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
    setSession(null);
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
          <div key={loc.id} className="flex flex-col gap-2">
            <a
              className="text-blue-300 text-bold py-1"
              href={`/location/${loc.id}`}
            >
              {loc.name}
              {loc.parentName && `, ${loc.parentName}`} (
              {loc.type[0].toUpperCase() + loc.type.slice(1)})
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
        {/* Brand + Links */}
        <div className="flex gap-16 items-center">
          <Link href="/" className="text-white text-2xl font-bold">
            Travel Guardian
          </Link>
          <Link href="/countries" className="text-blue-300 text-lg font-bold">
            Browse Countries
          </Link>
          {/* New "Send Location" link */}
          <Link href="/send-location" className="text-blue-300 text-lg font-bold">
            Send Location
          </Link>
        </div>

        {/* Search */}
        <form
          className="flex gap-4 items-center relative flex-1 max-w-md"
          onSubmit={search}
        >
          {searchResult}
          <input
            data-testid="search"
            type="text"
            placeholder="Location..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-black border border-gray-300 rounded p-2 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Search
          </button>
        </form>

        {/* Messaging icon + badge */}
        <div className="relative ml-6">
          <Link href="/messages" className="text-white hover:text-blue-300">
            <MessageCircle size={24} />
          </Link>
          {messageCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-1.5 py-0.5">
              {messageCount}
            </span>
          )}
        </div>

        {/* Profile icon */}
        {session && (
          <div className="relative ml-6">
            <Link href={`/profile/${session.userId}`} className="text-white hover:text-blue-300">
              <User size={24} />
            </Link>
          </div>
        )}

        {/* Auth */}
        <div className="ml-6">
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
