"use client";
import { getReports } from "@/model/report";
import { report } from "@prisma/client";
import { useEffect, useState } from "react";

type Props = {
    locationId: number;
}

export default function ListReports(props: Props) {
    const [reports, setReports] = useState<report[]>([]);
    useEffect(() => {
        getReports(props.locationId).then(setReports);
    }, [props.locationId]);

    return <div>
        <h1>Reports</h1>
        <ul>
            {reports.map((r) => <li key={r.id}><h4 className="text-3xl">{r.name}</h4>{r.desc}</li>)}
        </ul>
    </div>;
}