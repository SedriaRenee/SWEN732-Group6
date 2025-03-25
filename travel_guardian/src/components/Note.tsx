'use client';
import {useState} from "react";


type Props = {
    locationId: number;
};

export default function Note(props:Props) {

    return (
        <div className="flex flex-row justify-between items-center my-4">
            <h4 className="text-xl font-bold">Notes</h4>
        </div>
    );

}
