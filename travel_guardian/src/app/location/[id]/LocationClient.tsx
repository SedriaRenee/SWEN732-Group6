'use client';

import { FullLocation } from '@/model/location';
import { useState, useEffect } from 'react';

export default function LocationClient({ location }: { location: FullLocation }) {
    return <div>
        <a href="/" className="text-blue-500 text-lg font-bold">Back</a>
        <div>
            <h1 className="text-white text-xl font-black"> {location.name} ({location.type}) </h1>
            {location.parent && <h3> in <a className="text-blue-500 text-bold" href={`/location/${location.parent.id}`}>{location.parent.name}</a> </h3>}
            {location.children.length > 0 && <h3> Contains: </h3>}
            <ul className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 list-none px-5">
                {location.children.map((child) => {
                    return <li key={child.id} className="border border-gray-300 p-4 rounded-lg shadow-md bg-gray-100 hover:scale-105 transition duration-200 ease-in-out">
                        <a className="text-blue-500 text-bold" href={`/location/${child.id}`}>{child.name}</a>
                    </li>
                })}
            </ul>

        </div>

    </div>
}