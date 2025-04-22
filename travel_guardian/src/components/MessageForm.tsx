// "use client";

// import { useState } from "react";

// interface MessageFormProps {
//   recipients: { id: string; name: string }[];
//   onSendMessage: (recipientId: string, content: string) => void;
// }

// export default function MessageForm({ recipients, onSendMessage }: MessageFormProps) {
//   const [content, setContent] = useState("");
//   const [selectedRecipient, setSelectedRecipient] = useState(recipients[0]?.id || "");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const trimmed = content.trim();
//     if (!trimmed || !selectedRecipient) return;
//     onSendMessage(selectedRecipient, trimmed);
//     setContent("");
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
//       <select
//         value={selectedRecipient}
//         onChange={(e) => setSelectedRecipient(e.target.value)}
//         className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//       >
//         {recipients.map((r) => (
//           <option key={r.id} value={r.id}>
//             {r.name}
//           </option>
//         ))}
//       </select>

//       <textarea
//         aria-label="Type a message"
//         placeholder="Type a message…"
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//         rows={2}
//       />

//       <button
//         type="submit"
//         disabled={!content.trim() || !selectedRecipient}
//         className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
//       >
//         Send
//       </button>
//     </form>
//   );
// }

