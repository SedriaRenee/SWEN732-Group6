import CreateReport from "@/components/CreateReport";
import { useEffect, useState } from "react";
import { getReports } from "@/model/report";
import { report } from "@prisma/client";
import { Modal, ModalContent } from "@heroui/react";
import { riskColors } from "@/model/risk";

type Props = {
  locationId: number;
  userId: number;
};

export default function Reports(props: Props) {
  const [createModal, setCreateModal] = useState(false);

  const [reports, setReports] = useState<report[]>([]);

  function closeModal() {
    setCreateModal(false);
    getReports(props.locationId).then(setReports); // update reports to include new
  }

  useEffect(() => {
    getReports(props.locationId).then(setReports);
  }, [props.locationId]);

  return (
    <div>
      <Modal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        className="bg-[#111111BB]"
      >
        <ModalContent
          className="fixed  bg-[#222222] p-8 rounded-lg shadow-lg"
          style={{ maxWidth: "600px", margin: "auto" }}
        >
          <CreateReport
            locationId={props.locationId}
            userId={props.userId}
            close={closeModal}
          />
        </ModalContent>
      </Modal>

      <div className="flex flex-row justify-between items-center my-4">
        <h4 className="text-xl font-bold">Reports</h4>
        <button
          className="bg-blue-700 hover:bg-blue-900 text-white text-sm p-2 rounded-lg w-32"
          onClick={() => setCreateModal(true)}
        >
          Create Report
        </button>
      </div>

      {reports.length === 0 && (
        <p className="pt-2 text-red-400 text-lg">No reports yet</p>
      )}
      <ul>
        {reports.map((r) => (
          <li key={r.id}>
            <div className="bg-slate-900 rounded-lg p-4 shadow-md mb-4">
              <div className="flex flex-row items-center justify-between">
                <h4 className="text-xl">{r.name}</h4>
                <span className={`${riskColors(r.tag!)} text-md rounded-md px-1`}>{r.tag}</span>
              </div>
              <p className="text-gray-400">{r.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
