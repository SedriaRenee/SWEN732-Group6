import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import {getAllDiscussions} from "@/model/discussions";
import {discussions} from '@prisma/client';
import CreateDiscus from "@/components/CreateDiscus";

Modal.setAppElement('#root');

type Props = {
    locationId: number;
};

export default function Discussion(props: Props) {
    const [createModal, setCreateModal] = useState(false);

    const [discussionsList, setDiscussionsList] = useState<discussions[]>([]);

    function closeModal() {
        setCreateModal(false);
        getAllDiscussions(props.locationId).then(setDiscussionsList); // update reports to include new
    }

    useEffect(() => {
        getAllDiscussions(props.locationId).then(setDiscussionsList);
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
                <CreateDiscus locationId={props.locationId} close={closeModal} />
            </Modal>

            <div className="flex flex-row justify-between items-center my-4">
                <h4 className="text-xl font-bold">Discussion</h4>
                <button
                    className="bg-blue-500 text-white p-2 rounded-lg"
                    onClick={() => setCreateModal(true)}
                >
                    Create Discussion
                </button>
            </div>

            {discussionsList.length === 0 && (
                <p className="pt-2 text-red-400 text-lg">No Discussions yet</p>
            )}
            <ul>
                {discussionsList.map((d) => (
                    <li key={d.id}>
                        <div className="bg-slate-900 rounded-lg p-4 shadow-md mb-4">
                            <h4 className="text-3xl">{d.title}</h4>
                            <p className="text-gray-400">{d.content}</p>
                        </div>

                    </li>
                ))}
            </ul>
        </div>
    );
}
