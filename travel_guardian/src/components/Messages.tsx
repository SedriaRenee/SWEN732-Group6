// "use client";

// import React, { useState, useEffect } from "react";
// import MessageForm from "@/components/MessageForm";
// import MessageList from "@/components/MessageList";
// import MessageSearch from "@/components/MessageSearch";

// export interface Message {
//   id: number;
//   sender: string;
//   senderPic: string;
//   content: string;
//   timestamp: string;
//   replyToId?: number;
// }

// export interface Conversation {
//   id: number;
//   participants: { name: string; profilePic: string }[];
//   lastMessage: { content: string; timestamp: string };
// }

// export default function MessagesPage() {
//     const [conversations, setConversations] = useState<Conversation[]>([]);
//     const [selectedId, setSelectedId] = useState<number | null>(null);
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [search, setSearch] = useState("");
//     const [showNew, setShowNew] = useState(false);
  
//     const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
//     const [editedContent, setEditedContent] = useState("");
  
//     // 1️⃣ Load all conversations
//     useEffect(() => {
//       fetch("/api/conversations")
//         .then((r) => r.json())
//         .then(setConversations)
//         .catch(console.error);
//     }, []);
  
//     // 2️⃣ Load messages whenever a convo is selected
//     useEffect(() => {
//       if (selectedId == null) return;
//       fetch(`/api/conversations/${selectedId}/messages`)
//         .then((r) => r.json())
//         .then(setMessages)
//         .catch(console.error);
//     }, [selectedId]);
  
//     const filtered = conversations.filter((c) =>
//       c.participants[0].name.toLowerCase().includes(search.toLowerCase())
//     );
//     const selectedConvo = conversations.find((c) => c.id === selectedId);
  
//     // 3️⃣ Send a brand-new message (from the "+ New" button)
//     const handleSendNew = (recipientId: string, content: string) => {
//       if (selectedId == null) return;
//       fetch(`/api/conversations/${selectedId}/messages`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ recipientId, content }),
//       })
//         .then(() => fetch(`/api/conversations/${selectedId}/messages`))
//         .then((r) => r.json())
//         .then(setMessages)
//         .catch(console.error);
//       setShowNew(false);
//     };
  
//     return (
//       <div className="flex h-screen bg-gray-100">
//         {/* Sidebar */}
//         <div className="w-80 bg-white border-r flex flex-col">
//           <div className="flex items-center justify-between p-4 border-b">
//             <h2 className="text-xl font-semibold">Messages</h2>
//             <button
//               onClick={() => setShowNew((v) => !v)}
//               className="text-green-600 hover:text-green-800"
//             >
//               + New
//             </button>
//           </div>
  
//           {/* New-message form */}
//           {showNew && selectedConvo && (
//             <div className="p-4 border-b">
//               <MessageForm
//                 recipients={selectedConvo.participants.map((p) => ({
//                   id: p.name, // You can adjust this based on how you uniquely identify participants
//                   name: p.name,
//                 }))}
//                 onSendMessage={handleSendNew}
//               />
//             </div>
//           )}
  
//           {/* Search */}
//           <div className="p-4">
//             <MessageSearch
//               value={search}
//               onChange={setSearch}
//               onClear={() => setSearch("")}
//             />
//           </div>
  
//           {/* Conversation list */}
//           <ul className="flex-1 overflow-y-auto">
//             {filtered.map((c) => {
//               const other = c.participants[0];
//               return (
//                 <li
//                   key={c.id}
//                   onClick={() => {
//                     setSelectedId(c.id);
//                     setShowNew(false);
//                   }}
//                   className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 ${
//                     selectedId === c.id ? "bg-gray-200" : ""
//                   }`}
//                 >
//                   <img
//                     src={other.profilePic}
//                     alt={other.name}
//                     className="w-12 h-12 rounded-full object-cover"
//                   />
//                   <div className="flex-1">
//                     <div className="font-medium">{other.name}</div>
//                     <div className="text-sm text-gray-500 truncate">
//                       {c.lastMessage.content}
//                     </div>
//                   </div>
//                   <div className="text-xs text-gray-400">
//                     {new Date(c.lastMessage.timestamp).toLocaleTimeString()}
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
  
//         {/* Conversation panel */}
//         <div className="flex-1 flex flex-col">
//           {selectedConvo ? (
//             <>
//               <div className="flex items-center p-4 bg-white border-b">
//                 <img
//                   src={selectedConvo.participants[0].profilePic}
//                   alt={selectedConvo.participants[0].name}
//                   className="w-12 h-12 rounded-full object-cover mr-3"
//                 />
//                 <div>
//                   <div className="font-medium">
//                     {selectedConvo.participants[0].name}
//                   </div>
//                   <div className="text-sm text-gray-500">
//                     Last msg at{" "}
//                     {new Date(
//                       selectedConvo.lastMessage.timestamp
//                     ).toLocaleTimeString()}
//                   </div>
//                 </div>
//               </div>
  
//               <div className="flex-1 p-4 overflow-y-auto bg-white">
//                 <MessageList
//                   messages={messages}
//                   onEditMessage={handleEditMessage}
//                   onDeleteMessage={handleDeleteMessage}
//                   onStartEditing={handleStartEditing}
//                   editingMessageId={editingMessageId}
//                   editedContent={editedContent}
//                   setEditedContent={setEditedContent}
//                   onCancelEditing={handleCancelEditing}
//                 />
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex items-center justify-center text-gray-500">
//               Select a conversation to start chatting
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }
  