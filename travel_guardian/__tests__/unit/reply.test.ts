import { prismaMock } from "../__mocks__/prismaMocks";
import { test, describe, beforeEach, afterEach, expect,vi } from "vitest";
import { createReply, getReplyHeads, updateReply, deleteReply } from "@/model/reply";


describe("Reply Service Tests ", () => {
    let userId: number;
    let discussionId: number;
    let locationId: number;
    let replyId: number;

    beforeEach(async () => {
        // Mock Location Creation
        const location = await prismaMock.location.create({
            data: { name: "Test Location", lat: "40.7128", lon: "-74.0060", type: "city" },
        });
        locationId = location.id;

        // Mock User Creation
        const user = await prismaMock.users.create({
            data: {
                username: "tester",
                email: "test@example.com",
                password: "password123",
                first_name: "Test",
                last_name: "User",
                type: "traveler",
            },
        });
        userId = user.id;

        // Mock Discussion Creation
        const discussion = await prismaMock.discussions.create({
            data: { title: "Test Discussion", content: "Discussion content", creatorId: userId, locationId },
        });
        discussionId = discussion.id;
    });

    afterEach(async () => {
        vi.resetAllMocks();
    });

    test("Create a new reply", async () => {
        expect.assertions(3);
        const reply = await createReply(userId, discussionId, "This is a test reply");
        replyId = reply.id;
        expect(reply).toHaveProperty("id");
        expect(reply).toHaveProperty("created_at")
        expect(reply.content).toBe("This is a test reply");
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
        const replies = await getReplyHeads(userId);
        expect(replies.some((r) => r.id === replyId)).toBe(false);
    });
});
