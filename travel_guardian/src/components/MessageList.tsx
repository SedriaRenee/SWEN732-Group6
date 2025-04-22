// "use client";
// import React from "react";
// import { Pencil, Trash2 } from "lucide-react";

// export interface ThreadedMessage {
//   id: number;
//   sender: string;
//   senderPic: string;
//   content: string;
//   timestamp: string;
//   replies?: ThreadedMessage[];
// }

// interface Props {
//   messages: ThreadedMessage[];
//   onEditMessage: (id: number, content: string) => void;
//   onDeleteMessage: (id: number) => void;
//   onStartEditing: (id: number) => void;
//   editingMessageId: number | null;
//   editedContent: string;
//   setEditedContent: (value: string) => void;
//   onCancelEditing: () => void;
// }

// const MessageList: React.FC<Props> = ({
//   messages,
//   onEditMessage,
//   onDeleteMessage,
//   onStartEditing,
//   editingMessageId,
//   editedContent,
//   setEditedContent,
//   onCancelEditing,
// }) => {
//   const currentUser = "You"; // Replace this with actual current user

//   const renderMessages = (msgs: ThreadedMessage[], level = 0) => {
//     let lastSender: string | null = null;

//     return msgs.map((msg) => {
//       const isCurrentUser = msg.sender === currentUser;
//       const showAvatar = lastSender !== msg.sender;
//       lastSender = msg.sender;

//       return (
//         <div
//           key={msg.id}
//           className={`group flex items-end space-x-2 mb-4 ${
//             isCurrentUser ? "justify-end" : "justify-start"
//           } ${level > 0 ? `ml-${level * 4}` : ""}`}
//         >
//           {/* Avatar */}
//           {!isCurrentUser && showAvatar && (
//             <img
//               src={msg.senderPic}
//               alt={msg.sender}
//               className="w-8 h-8 rounded-full object-cover"
//             />
//           )}
//           {!isCurrentUser && !showAvatar && <div className="w-8" />} {/* Spacer */}

//           <div className="relative max-w-xs">
//             {/* Editable message content */}
//             {editingMessageId === msg.id ? (
//               <textarea
//                 value={editedContent}
//                 onChange={(e) => setEditedContent(e.target.value)}
//                 className="px-4 py-2 text-sm rounded-2xl w-full"
//               />
//             ) : (
//               <div
//                 className={`px-4 py-2 text-sm rounded-2xl ${
//                   isCurrentUser
//                     ? "bg-blue-500 text-white rounded-br-none"
//                     : "bg-gray-200 text-gray-900 rounded-bl-none"
//                 }`}
//               >
//                 {msg.content}
//               </div>
//             )}

//             {/* Timestamp */}
//             <div
//               className={`text-[10px] mt-1 ${
//                 isCurrentUser ? "text-right" : "text-left"
//               } text-gray-400`}
//             >
//               {msg.sender} · {new Date(msg.timestamp).toLocaleTimeString()}
//             </div>

//             {/* Hover Actions */}
//             {isCurrentUser && !editingMessageId && (
//               <div className="absolute right-full top-0 hidden group-hover:flex items-center gap-1 pr-1">
//                 <button
//                   onClick={() => onStartEditing(msg.id)}
//                   className="text-gray-400 hover:text-blue-600"
//                   title="Edit"
//                 >
//                   <Pencil size={16} />
//                 </button>
//                 <button
//                   onClick={() => onDeleteMessage(msg.id)}
//                   className="text-gray-400 hover:text-red-600"
//                   title="Delete"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             )}
//             {/* Save or Cancel */}
//             {editingMessageId === msg.id && (
//               <div className="mt-2 flex gap-2">
//                 <button
//                   onClick={() => onEditMessage(msg.id, editedContent)}
//                   className="bg-blue-500 text-white px-4 py-1 rounded"
//                 >
//                   Save
//                 </button>
//                 <button
//                   onClick={onCancelEditing}
//                   className="bg-gray-300 text-gray-800 px-4 py-1 rounded"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Avatar for current user (on the right) */}
//           {isCurrentUser && showAvatar && (
//             <img
//               src={msg.senderPic}
//               alt={msg.sender}
//               className="w-8 h-8 rounded-full object-cover ml-2"
//             />
//           )}
//           {isCurrentUser && !showAvatar && <div className="w-8" />} {/* Spacer */}
//         </div>
//       );
//     });
//   };

//   return <div className="space-y-1">{renderMessages(messages)}</div>;
// };

// export default MessageList;
