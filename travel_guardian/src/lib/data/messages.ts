// lib/data/messages.ts
export const conversationMessages: Record<number, any[]> = {
    1: [ ],
    2: [
      {
        id: 2,
        sender: "Mike Brown",
        senderPic: "/avatars/mike.png",
        content: "Let's plan our next trip!",
        timestamp: new Date().toISOString(),
      }
    ],
    3: [
      {
        id: 3,
        sender: "Jane Easter",
        senderPic: "/avatars/jane.png",
        content: "When are we leaving?",
        timestamp: new Date().toISOString(),
      }
    ]
  };
  