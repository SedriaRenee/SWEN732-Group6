import { useState, useEffect } from 'react';
import { getAllDiscussions } from "@/model/discussions";
import { discussion } from '@prisma/client';
import CreateDiscus from "@/components/CreateDiscus";
import {Modal,Button,ModalContent} from "@heroui/react";
import Link from "next/link";
import { getSession } from '@/lib/session';

type Props = {
    locationId: number;
};

export default function Discussion(props: Props) {
    const [createModal, setCreateModal] = useState(false);
    const [discussionsList, setDiscussionsList] = useState<discussion[]>([]);
    
    const [session, setSession] = useState<any>(null);
    
      useEffect(() => {
        async function fetchSession() {
          const session = await getSession();
          setSession(session);
        }
        fetchSession();
      }, []);



    function closeModal() {
        setCreateModal(false);
        getAllDiscussions(props.locationId).then(
            (data) => setDiscussionsList(data),
        );
    }

    useEffect(() => {
        getAllDiscussions(props.locationId).then(
            (data) => setDiscussionsList(data),
        );
    }, [props.locationId]);

    return (
        <div>
            <Modal isOpen={createModal} onClose={() => setCreateModal(false)} className="bg-[#111111BB]">
                <ModalContent className="fixed  bg-[#222222] p-8 rounded-lg shadow-lg" style={{ maxWidth: '600px', margin: 'auto' }}>
                    {session ? <CreateDiscus locationId={props.locationId} close={closeModal} userId={session.userId} /> : <div/>}
                </ModalContent>
            </Modal>
            <div className="flex flex-row justify-between items-center my-4">
                <h4 className="text-xl font-bold">Discussion</h4>
                <Button
                    className="bg-blue-500 text-white p-2 rounded-lg"
                    onPress={() => setCreateModal(true)}
                >
                    Create Discussion
                </Button>
            </div>

            {discussionsList.length === 0 && (
                <p className="pt-2 text-red-400 text-lg">No Discussions yet</p>
            )}

            <ul>
                {discussionsList.map((d) => (
                    <li key={d.id}>
                        <div className="bg-slate-900 rounded-lg p-4 shadow-md mb-4">
                            <Link href={`/discussions/${d.id}`}>
                            <h4 className="text-3xl">{d.title}</h4>
                            <p className="text-gray-400">{d.content}</p>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
