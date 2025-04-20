"use client";
import Reports from "@/components/Reports";
import { FullLocation, getGuidelines } from "@/model/location";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Discussion from "@/components/Discussion";
import { guideline } from "@prisma/client";
import { Dropdown, DropdownItem, DropdownTrigger, DropdownMenu, Button } from "@heroui/react";
import { doesUserWantToVisit, hasUserVisited, isUserHome, toggleUserHome, toggleUserVisit, toggleUserWantToVisit } from "@/model/user";
import { getSession } from "@/lib/session";

export default function LocationPage({ location }: { location: FullLocation }) {
  const [filter, setFilter] = useState("");
  const [filteredGuidelines, setFilteredGuidelines] = useState<guideline[]>([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set(["SEARCH BY TAG"]));
  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys],
  );
  const sortedChildren = location.children.toSorted((a, b) =>
    a.name.localeCompare(b.name)
  );

  const [guidelines, setGuidelines] = useState<guideline[]>([]);
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

    async function fetchVisited() {
      const session = await getSession();
      if (session && session.userId != null) {
        const want = await doesUserWantToVisit(
          Number(session.userId),
          location.id
        );
        setWantsToVisit(want != null)

        const visit = await hasUserVisited(
          Number(session.userId),
          location.id
        );
        setVisited(visit != null);
        const home = await isUserHome(
          Number(session.userId),
          location.id
        );
        setHometown(home);
      }
    }
    fetchVisited();
  }, []);

  async function markVisited(b: boolean) {
    setVisited(b);

    const session = await getSession();
    if (session && session.userId != null) {
      toggleUserVisit(Number(session.userId), location.id);
    }
  }

  async function markWantsToVisit(b: boolean) {
    setWantsToVisit(b);
    const session = await getSession();
    if (session && session.userId != null) {
      toggleUserWantToVisit(Number(session.userId), location.id);
    }
  }

  async function markHometown(b: boolean) {
    setHometown(b);
    const session = await getSession();
    if (session && session.userId != null) {
      toggleUserHome(Number(session.userId), location.id);
    }
  }

  const handleSelectionChange = (keys: any) => {
    const newSelectedKeys = new Set(keys as Iterable<string>);
    setSelectedKeys(newSelectedKeys); // Update the state with the new selection
  };
  // Function to retrieve a master list of SPECIFIC guidelines 
  function filterItems() { // by location TAG
    console.log(selectedKeys); 
    if (selectedValue == 'none') {
      console.log('none was selected'); 
      setFilteredGuidelines([]); // RESET
      return; 
    }
    
    const IT = guidelines.entries();
    
    var allEntries = []; // return master list of specified entries

    // HASH MAP to filter tag to tags of entry
    const filterList = new Map([
      ['none', ''], // redundant case should be cleared
      ['general','general'],
      ['requirements', 'Entry requirements'],
      ['warning','Warnings'],
      ['insurance', 'insurance']
    ]);
    
    for (const entry of IT) {
      // console.log(entry[1].id);
      // console.log(entry[1].title);
      // console.log(entry[1].note);
      // console.log(entry[1].tags);
      for (const item of entry[1].tags) {
        if (filterList.get(selectedValue) == item) {
          allEntries.push(entry[1]);
        } 
      }
    }
    console.log(allEntries);
    setFilteredGuidelines(allEntries);
  }

  useEffect(() => {
    filterItems();
  }, [selectedValue]); // if user changes tag

  return (
    <div>
      <div className="min-h-screen bg-gray-800 p-8 flex flex-col gap-4">
        <h1 className="text-white text-xl font-black">
          {location.name} ({location.type})
        </h1>
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
                <DropdownItem key="general">GENERAL</DropdownItem>
                <DropdownItem key="requirements">PASSPORT</DropdownItem>
                <DropdownItem key="warning">WARNING</DropdownItem>
                <DropdownItem key="insurance">INSURANCE</DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
              {hometown ? "Unset" : "Set"} Hometown
            </button>
          ) : (
            <div />
          )}
        </div>

        <div className="flex flex-col gap-4">
        {selectedValue === 'none'
          ? guidelines.map((g) => (
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
            ))
          : filteredGuidelines.map((g) => (
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
