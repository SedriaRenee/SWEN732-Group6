import { test, describe, beforeAll, afterAll, beforeEach, afterEach, expect } from "vitest";
import { createReply, getReplyHistory, updateReply, deleteReply } from "@/model/reply";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

beforeAll(async () => {
    await prisma.$connect();
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe("Reply Service Tests", () => {
    let userId: number;
    let discussionId: number;
    let locationId: number;
    let replyId: number;

    beforeEach(async () => {
        // Create test location
        const location = await prisma.location.create({
            data: { name: "Test Location", lat: "40.7128", lon: "-74.0060", type: "city" },
        });
        locationId = location.id;

        // Create test user
        const user = await prisma.users.create({
            data: {
                username: "testuser",
                email: "test@example.com",
                password: "password123",
                first_name: "Test",
                last_name: "User",
                type: "travler",
            },
        });
        userId = user.id;

        // Create test discussion
        const discussion = await prisma.discussions.create({
            data: { title: "Test Discussion", content: "Discussion content", creatorId: userId, locationId },
        });
        discussionId = discussion.id;
    });

    afterEach(async () => {
        await prisma.reply.deleteMany();
        await prisma.discussions.deleteMany();
        await prisma.users.deleteMany();
        await prisma.location.deleteMany();
    });

    test("Create a new reply", async () => {
        expect.assertions(2);
        const reply = await createReply(userId, discussionId, "This is a test reply");
        replyId = reply.id;
        expect(reply).toHaveProperty("id");
        expect(reply.content).toBe("This is a test reply");
    });

    test("Fetch reply history for user", async () => {
        expect.assertions(2);
        const reply = await createReply(userId, discussionId, "Another reply");
        replyId = reply.id;

        const replies = await getReplyHistory(userId);
        expect(replies.length).toBeGreaterThan(0);
        expect(replies[0].creatorId).toBe(userId);
    });

    test("Update a reply", async () => {
        expect.assertions(1);
        const reply = await createReply(userId, discussionId, "Initial content");
        replyId = reply.id;

        const updatedReply = await updateReply(replyId, "Updated reply content");
        expect(updatedReply.content).toBe("Updated reply content");
    });

    test("Delete a reply", async () => {
        expect.assertions(1);
        const reply = await createReply(userId, discussionId, "To be deleted");
        replyId = reply.id;

        await deleteReply(replyId);
        const replies = await getReplyHistory(userId);
        expect(replies.some((r) => r.id === replyId)).toBe(false);
    });
});
