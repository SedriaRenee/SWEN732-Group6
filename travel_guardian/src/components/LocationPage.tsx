"use client";
import Reports from "@/components/Reports";
import { FullLocation, getGuidelines } from "@/model/location";
import Link from "next/link";
import { useEffect, useState } from "react";
import Discussion from "@/components/Discussion";
import { guideline } from "@prisma/client";

export default function LocationPage({ location }: { location: FullLocation }) {
  const [filter, setFilter] = useState("");
  const sortedChildren = location.children.toSorted((a, b) =>
    a.name.localeCompare(b.name)
  );

  const [guidelines, setGuidelines] = useState<guideline[]>([]);

  // TODO: load if user has visited, wants to visit, or is hometown
  const [visited, setVisited] = useState(false);
  const [wantsToVisit, setWantsToVisit] = useState(false);
  const [hometown, setHometown] = useState(false);

  useEffect(() => {
    async function fetchGuidelines() {
      const g = await getGuidelines(location.id);
      console.log("found " + g.length + " guidelines");
      setGuidelines(g);
    }
    fetchGuidelines();
  }, []);

  function markVisited(b: boolean) {
    setVisited(b);
    // TODO: save to db
  }

  function markWantsToVisit(b: boolean) {
    setWantsToVisit(b);
  }

  function markHometown(b: boolean) {
    setHometown(b);
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-800 p-8 flex flex-col gap-4">
        <h1 className="text-white text-xl font-black">
          {location.name} ({location.type})
        </h1>

        {location.parent && (
          <h3>
            in{" "}
            <Link
              className="text-blue-500 text-bold"
              href={`/location/${location.parent.id}`}
            >
              {location.parent.name}
            </Link>
          </h3>
        )}

        {location.children.length > 0 && (
          <div className="bg-blue-900 p-4 mt-4 rounded-lg shadow-md relative">
            <h3
              className="absolute left-2 font-extrabold"
              style={{ top: "-10px" }}
            >
              CONTAINS:
            </h3>
            <form>
              <input
                type="text"
                placeholder="Filter..."
                className="border border-blue-500 text-black px-2 py-1 rounded-lg shadow-md bg-gray-100 absolute"
                style={{ top: "-24px", right: "8px" }}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </form>
            <ul className="flex flex-row gap-4 pt-2 list-none w-full overflow-auto whitespace-nowrap">
              {sortedChildren.map((child) => {
                if (child.name.toLowerCase().indexOf(filter.toLowerCase()) < 0)
                  return;
                return (
                  <li
                    key={child.id}
                    className="border border-gray-300 px-4 py-2 rounded-lg shadow-md bg-gray-100 hover:scale-105 transition duration-200 ease-in-out"
                  >
                    <a
                      className="text-blue-500 text-bold"
                      href={`/location/${child.id}`}
                    >
                      {child.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="flex flex-row gap-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => markWantsToVisit(!wantsToVisit)}
          >
            {wantsToVisit ? "Remove from" : "Add to"} Places to Visit
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => markVisited(!visited)}
          >
            {visited ? "Remove from" : "Add to"} Places Visited
          </button>

          {visited ? (
            <button
              onClick={() => markHometown(!hometown)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Set Hometown
            </button>
          ) : (
            <div />
          )}
        </div>

        <div className="flex flex-col gap-4">
          {guidelines.map((g) => (
            <div
              key={g.id}
              className="bg-slate-900 rounded-lg p-4 shadow-md mb-4"
            >
              <div className="flex flex-row gap-2">
                <h4 className="text-xl">{g.title}</h4>
                <p className="text-gray-400">{g.created.toString()}</p>
                <p className="text-gray-400">{g.tags}</p>
              </div>
              <p className="text-gray-400">{g.note}</p>
            </div>
          ))}
        </div>

        <Reports locationId={location.id} />
        <Discussion locationId={location.id} />
      </div>
    </div>
  );
}
