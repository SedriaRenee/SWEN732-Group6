// // app/api/conversations/route.ts
// import { NextResponse } from 'next/server';
// import { conversationMessages } from '@/lib/data/messages';

// export async function GET() {
//   const conversations = Object.entries(conversationMessages).map(([id, messages]) => {
//     const last = messages[messages.length - 1];
//     return {
//       id: Number(id),
//       participants: [
//         { name: last.sender, profilePic: last.senderPic || "/avatars/default.png" },
//         { name: "You", profilePic: "/public/user.png" },
//       ],
//       lastMessage: {
//         content: last.content,
//         timestamp: last.timestamp,
//       },
//     };
//   });

//   return NextResponse.json(conversations);
// }
