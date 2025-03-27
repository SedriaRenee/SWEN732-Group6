"use client";
import { createLocation } from "@/model/location";
import React, { useEffect, useState } from "react";

const exampleLocations = [
  {
    name: "Cairo",
    parentName: "Egypt",
  },
  {
    name: "Paris",
    parentName: "France",
  },
  {
    name: "London",
    parentName: "UK",
  },
  {
    name: "Tokyo",
    parentName: "Japan",
  },
  {
    name: "Sydney",
    parentName: "Australia",
  },
];

export default function LocationPage() {
  const [rand, setRandChoice] = useState<number | null>(null);
  const [status, setStatus] = useState();

  const [name, setName] = useState("");
  const [parent, setParent] = useState("");

  useEffect(() => {
    setRandChoice(Math.floor(Math.random() * exampleLocations.length));
  }, []);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    createLocation(name, parent).then((loc) => {
      console.log("Created location with id", loc.id);
      setName("");
      setParent("");
    });
  }

  return (
      <div className="flex flex-col gap-4 items-center w-full min-h-screen">
        <div>
          <h2 className="text-center text-blue-500 text-2xl">
            Request New Location
          </h2>

          {rand != null ? (
              <form
                  onSubmit={submit}
                  className="flex flex-col justify-content items-center w-1/2 m-auto"
              >
                <label htmlFor="locName" className="mt-3">
                  Name of Location (e.g. '{exampleLocations[rand].name}')
                </label>
                <input
                    id="locName"
                    type="text"
                    className="w-full text-center p-1 m-1 text-black"
                    placeholder={`Rochester`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <label htmlFor="locName" className="mt-3">
                  Parent Location (e.g. '{exampleLocations[rand].parentName}')
                </label>
                <input
                    id="locName"
                    type="text"
                    className="w-full text-center p-1 m-1 text-black"
                    placeholder={`New York`}
                    value={parent}
                    onChange={(e) => setParent(e.target.value)}
                />

                <input
                    type="submit"
                    value="Submit Locaton Request"
                    className="w-full mt-3 p-2 bg-blue-500 font-bold background"
                />
              </form>
          ) : (
              <div/>
          )}
        </div>

        <div>
          <h1> Frequently Visited Locations </h1>
          <ul>
            <li>TODO</li>
          </ul>
        </div>
      </div>
  );
}
