"use client";
import Reports from "@/components/Reports";
import { FullLocation, getGuidelines } from "@/model/location";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Discussion from "@/components/Discussion";
import { guideline } from "@prisma/client";
import {
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
  Button,
} from "@heroui/react";
import {
  doesUserWantToVisit,
  hasUserVisited,
  isUserHome,
  toggleUserHome,
  toggleUserVisit,
  toggleUserWantToVisit,
} from "@/model/user";
import { getSession } from "@/lib/session";

export default function LocationPage({ location }: { location: FullLocation }) {
  const [filter, setFilter] = useState("");
  const [filteredGuidelines, setFilteredGuidelines] = useState<guideline[]>([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set(["SEARCH BY TAG"]));
  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys]
  );
  const sortedChildren = location.children.toSorted((a, b) =>
    a.name.localeCompare(b.name)
  );

  const [guidelines, setGuidelines] = useState<guideline[]>([]);
  const [visited, setVisited] = useState(false);
  const [wantsToVisit, setWantsToVisit] = useState(false);
  const [hometown, setHometown] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    async function fetchGuidelines() {
      const g = await getGuidelines(location.id);
      setGuidelines(g);
    }
    fetchGuidelines();

    async function fetchVisited() {
      const session = await getSession();
      setSession(session);
      if (session && session.userId != null) {
        const want = await doesUserWantToVisit(
          Number(session.userId),
          location.id
        );
        setWantsToVisit(want != null);

        const visit = await hasUserVisited(Number(session.userId), location.id);
        setVisited(visit != null);
        const home = await isUserHome(Number(session.userId), location.id);
        setHometown(home);
      }
    }
    fetchVisited();
  }, []);

  async function markVisited(b: boolean) {
    setVisited(b);
    if (!b && hometown) {
      setHometown(false);
    }
    toggleUserVisit(Number(session.userId), location.id);
  }

  async function markWantsToVisit(b: boolean) {
    setWantsToVisit(b);
    toggleUserWantToVisit(Number(session.userId), location.id);
  }

  async function markHometown(b: boolean) {
    setHometown(b);
    toggleUserHome(Number(session.userId), location.id);
  }

  const handleSelectionChange = (keys: any) => {
    const newSelectedKeys = new Set(keys as Iterable<string>);
    setSelectedKeys(newSelectedKeys); // Update the state with the new selection
  };
  // Function to retrieve a master list of SPECIFIC guidelines
  function filterItems() {
    // console.log(selectedKeys);
    if (selectedValue == "none") {
      console.log("none was selected");
      setFilteredGuidelines([]); // RESET
      return;
    }

    const IT = guidelines.entries();

    var allEntries = []; // return master list of specified entries

    // HASH MAP to filter tag to tags of entry
    const filterList = new Map([
      ["none", [""]], // redundant case should be cleared
      ["general", ["Entry requirements"]],
      ["risks", ["Safety and security", "Regional risks"]],
      ["support",["Getting help", "Warning and Insurance"]],
      ["health", ["Health"]],
    ]);

    for (const entry of IT) {
      const title = entry[1].title;
      const tmp = filterList.get(selectedValue) || [];
      for (const item of tmp) {
        if (title == item) {
          allEntries.push(entry[1]);
        }
      }
    }
    // console.log(allEntries);
    setFilteredGuidelines(allEntries);
  }

  useEffect(() => {
    filterItems();
  }, [selectedValue]); // if user changes tag

  return (
    <div>
      <div className="min-h-screen bg-gray-800 p-8 flex flex-col gap-4">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-col">
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
          </div>

          <div className="flex flex-row gap-2">
            {!visited && (
              <button
                className={`${
                  wantsToVisit
                    ? "bg-yellow-700 hover:bg-red-700"
                    : "bg-blue-700 hover:bg-blue-900"
                } text-white text-sm font-bold py-2 px-4 rounded`}
                onClick={() => markWantsToVisit(!wantsToVisit)}
              >
                {wantsToVisit ? "Want to Visit" : "Add to Places to Visit"}
              </button>
            )}

            {!wantsToVisit && (
              <button
                className={`${
                  visited
                    ? "bg-green-700 hover:bg-red-700"
                    : "bg-blue-700 hover:bg-blue-900"
                } text-white text-sm font-bold py-2 px-4 rounded`}
                onClick={() => markVisited(!visited)}
              >
                {visited ? "Visited" : "Add Place Visited"}
              </button>
            )}

            {visited ? (
              <button
                onClick={() => markHometown(!hometown)}
                className={`${
                  hometown
                    ? "bg-green-700 hover:bg-red-700"
                    : "bg-blue-700 hover:bg-blue-900"
                } text-white text-sm font-bold py-2 px-4 rounded`}
              >
                {hometown ? "Unset" : "Set"} Hometown
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>

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

        <h3 className="text-2xl font-bold">Travel Guidelines</h3>
        <Dropdown>
          <DropdownTrigger>
            <Button className="capitalize" variant="bordered">
              {selectedValue}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Single selection example"
            selectedKeys={selectedKeys}
            selectionMode="single"
            variant="flat"
            onSelectionChange={handleSelectionChange}
          >
            <DropdownItem key="none">NONE</DropdownItem>
            <DropdownItem key="general">TRAVEL</DropdownItem>
            <DropdownItem key="support">SUPPORT</DropdownItem>
            <DropdownItem key="health">HEALTH</DropdownItem>
            <DropdownItem key="risks">SAFETY</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <div className="flex flex-col gap-4">
          {selectedValue === "none"
            ? guidelines.map((g) => (
                <div
                  key={g.id}
                  className="bg-slate-900 rounded-lg p-4 shadow-md mb-4"
                >
                  <div className="flex flex-row gap-2">
                    <h4 className="text-xl">{g.title}</h4>
                    <p className="text-gray-400">{g.tags}</p>
                  </div>
                  <p className="text-gray-400">{g.content}</p>
                </div>
              ))
            : filteredGuidelines.map((g) => (
                <div
                  key={g.id}
                  className="bg-slate-900 rounded-lg p-4 shadow-md mb-4"
                >
                  <div className="flex flex-row gap-2">
                    <h4 className="text-xl">{g.title}</h4>
                    <p className="text-gray-400">{g.tags}</p>
                  </div>
                  <p className="text-gray-400">{g.content}</p>
                </div>
              ))}
        </div>

        <h3 className="text-2xl font-bold">Reports and Discussions</h3>
        {session && session.userId && (
          <div>
            <Reports locationId={location.id} userId={session.userId} />
            <Discussion locationId={location.id} userId={session.userId} />
          </div>
        )}
      </div>
    </div>
  );
}
