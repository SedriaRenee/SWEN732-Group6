'use client';
import Reports from '@/components/Reports';
import { FullLocation } from '@/model/location';
import Link from 'next/link';
import { useState } from 'react';

export default function LocationPage({
  location,
}: {
  location: FullLocation;
}) {
  const [filter, setFilter] = useState('');
  const sortedChildren = location.children.toSorted((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <div>
        <h1 className="text-white text-xl font-black">
          {location.name} ({location.type})
        </h1>

        {location.parent && (
          <h3>
            in <Link
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
              style={{ top: '-10px' }}
            >
              CONTAINS:
            </h3>
            <form>
              <input
                type="text"
                placeholder="Filter..."
                className="border border-blue-500 text-black px-2 py-1 rounded-lg shadow-md bg-gray-100 absolute"
                style={{ top: '-24px', right: '8px' }}
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

        <Reports locationId={location.id} />
      </div>
    </div>
  );
}
