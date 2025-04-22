// // app/api/conversations/[id]/messages/[messageId]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { conversationMessages } from "@/lib/data/messages";
// import { getSession } from "@/lib/session";       // your session helper
// import  prisma  from "@/lib/prisma";           // your Prisma client

// // PUT /api/conversations/:id/messages/:messageId
// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string; messageId: string } }
// ) {
//   const convId = parseInt(params.id, 10);
//   const msgId = parseInt(params.messageId, 10);
//   const { content } = await req.json();

//   // Ensure content exists
//   if (!content) {
//     return NextResponse.json({ error: "Message content is required." }, { status: 400 });
//   }

//   // derive sender from session
//   const session = await getSession(req);
//   const userId = session?.userId;
//   if (!userId) {
//     return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//   }

//   // fetch user record (username + profilePic)
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//     select: { username: true, profilePic: true },
//   });
//   if (!user) {
//     return NextResponse.json({ error: "User not found" }, { status: 404 });
//   }

//   const sender = user.username;
//   const senderPic = user.profilePic ?? "/user.png"; // default to /public/user.png

//   // Fetch conversation and find the message to edit
//   const messages = conversationMessages[convId];
//   if (!messages) {
//     return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
//   }

//   const message = messages.find(m => m.id === msgId);
//   if (!message) {
//     return NextResponse.json({ error: "Message not found" }, { status: 404 });
//   }

//   // Check if the user is the sender
//   if (message.sender !== sender) {
//     return NextResponse.json({ error: "Not authorized" }, { status: 403 });
//   }

//   // Update message content and mark as edited
//   message.content = content;
//   message.senderPic = senderPic;  // ensure the senderPic is updated if needed
//   message.edited = true;
//   message.lastEdited = new Date().toISOString();

//   return NextResponse.json(message);
// }

// // DELETE /api/conversations/:id/messages/:messageId
// export async function DELETE(
//     req: NextRequest,
//     { params }: { params: { id: string; messageId: string } }
//   ) {
//     const convId = parseInt(params.id, 10);
//     const msgId = parseInt(params.messageId, 10);
  
//     // derive sender from session
//     const session = await getSession(req);
//     const userId = session?.userId;
//     if (!userId) {
//       return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//     }
  
//     // fetch user record (username + profilePic)
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { username: true, profilePic: true },
//     });
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }
  
//     const sender = user.username;
  
//     // Fetch conversation and find the message to delete
//     const messages = conversationMessages[convId];
//     if (!messages) {
//       return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
//     }
  
//     const index = messages.findIndex(m => m.id === msgId);
//     if (index === -1) {
//       return NextResponse.json({ error: "Message not found" }, { status: 404 });
//     }
  
//     // Check if the user is the sender
//     if (messages[index].sender !== sender) {
//       return NextResponse.json({ error: "Not authorized" }, { status: 403 });
//     }
  
//     // Remove message
//     messages.splice(index, 1);
  
//     return NextResponse.json({ success: true });
//   }