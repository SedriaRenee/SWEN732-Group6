import Modal from 'react-modal';
import CreateReport from '@/components/CreateReport';
import { useEffect, useState } from 'react';
import { getReports } from '@/model/report';
import { report } from '@prisma/client';

Modal.setAppElement('#root');

type Props = {
  locationId: number;
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
        onRequestClose={() => setCreateModal(false)}
        style={{
          overlay: {
            backgroundColor: '#111111BB',
          },
          content: {
            backgroundColor: '#222222',
            width: 'max-content',
            height: 'max-content',
            margin: 'auto',
          },
        }}
      >
        <CreateReport locationId={props.locationId} close={closeModal} />
      </Modal>

      <div className="flex flex-row justify-between items-center my-4">
        <h4 className="text-xl font-bold">Reports</h4>
        <button
          className="bg-blue-500 text-white p-2 rounded-lg"
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
                <h4 className="text-3xl">{r.name}</h4>
                <p className="text-gray-400">{r.desc}</p>
            </div>
            
          </li>
        ))}
      </ul>
    </div>
  );
}
