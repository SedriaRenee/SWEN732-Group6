// // app/api/conversations/[id]/messages/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { conversationMessages } from "@/lib/data/messages";
// import { getSession } from "@/lib/session";       // your session helper
// import  prisma  from "@/lib/prisma";           // your Prisma client

// // Only ever inject this once, at the very top of the thread
// const getWelcomeMessage = () => ({
//   id: Date.now(),
//   sender: "TravelGuardian Bot",
//   senderPic: "/user.png",           // default bot avatar in /public
//   content: "Welcome to TravelGuardian! How can I assist you today?",
//   timestamp: new Date().toISOString(),
// });

// // GET  /api/conversations/:id/messages
// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const convId = parseInt(params.id, 10);
//   let msgs = conversationMessages[convId] || [];

//   // ensure welcome stays only once
//   if (!msgs.some((m) => m.sender === "TravelGuardian Bot")) {
//     const welcome = getWelcomeMessage();
//     msgs = [welcome, ...msgs];
//     conversationMessages[convId] = msgs;
//   }

//   return NextResponse.json(msgs);
// }

// // POST /api/conversations/:id/messages
// export async function POST(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const convId = parseInt(params.id, 10);
//   const { content } = await req.json();

//   if (!content) {
//     return NextResponse.json(
//       { error: "Message content is required." },
//       { status: 400 }
//     );
//   }

//   // derive sender from session
//   const session = await getSession(req);
//   const userId = session?.userId;
//   if (!userId) {
//     return NextResponse.json(
//       { error: "Not authenticated" },
//       { status: 401 }
//     );
//   }

//   // fetch the actual user record (username + profilePic)
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//     select: { username: true, profilePic: true },
//   });
//   if (!user) {
//     return NextResponse.json(
//       { error: "User not found" },
//       { status: 404 }
//     );
//   }

//   const sender    = user.username;
//   const senderPic = user.profilePic ?? "/user.png"; // default in /public

//   const newMsg = {
//     id: Date.now(),                     // simple unique ID
//     sender,
//     senderPic,
//     content,
//     timestamp: new Date().toISOString(),
//   };

//   // ensure the array exists
//   if (!conversationMessages[convId]) {
//     conversationMessages[convId] = [];
//   }
//   conversationMessages[convId].push(newMsg);

//   return NextResponse.json(newMsg, { status: 201 });
// }
