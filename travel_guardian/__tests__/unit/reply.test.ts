import { test, describe, beforeEach, afterEach, expect,vi } from "vitest";
import { createReply, getReplyHeads, updateReply, deleteReply } from "@/model/reply";
import { prisma } from "@/lib/db";
import { createDiscussion } from "@/model/discussions";
import { testCity, testDiscussion, testReply, testUser } from "../constants";
import { createLocation } from "@/model/location";

vi.mock("@/lib/db");

describe("Reply Service Tests ", () => {
    let userId: number;
    let discussionId: number;
    let locationId: number;
    let replyId: number;

    beforeEach(async () => {
        vi.resetAllMocks();

        // Mock Location Creation
        vi.spyOn(prisma.location, "create").mockResolvedValue(testCity);
        const loc = await createLocation(testCity.name, "");
        locationId = loc.id;


        // Mock User Creation
        vi.spyOn(prisma.user, "create").mockResolvedValue(testUser);
        const user = await prisma.user.create({data: testUser });
        userId = user.id;


        vi.spyOn(prisma.discussions, "create").mockResolvedValue(testDiscussion);
        const discussion = await createDiscussion(testDiscussion.title, testDiscussion.content, userId, locationId);
        discussionId = discussion.id;
    });

    afterEach(async () => {
        vi.resetAllMocks();
    });

    test("Create a new reply", async () => {
        expect.assertions(3);

        vi.spyOn(prisma.reply, "create").mockResolvedValue(testReply);
        const reply = await createReply(userId, discussionId, testReply.content);
        replyId = reply.id;
        expect(reply).toHaveProperty("id");
        expect(reply).toHaveProperty("created_at")
        expect(reply.content).toBe(testReply.content);
    });

    test("Update a reply", async () => {
        expect.assertions(1);

        vi.spyOn(prisma.reply, "create").mockResolvedValue(testReply);
        const reply = await createReply(userId, discussionId, testReply.content);
        replyId = reply.id;

        vi.spyOn(prisma.reply, "update").mockResolvedValue({...testReply, content: "Updated reply content"});
        const updatedReply = await updateReply(replyId, "Updated reply content");
        expect(updatedReply.content).toBe("Updated reply content");
    });

    test("Delete a reply", async () => {
        expect.assertions(1);

        vi.spyOn(prisma.reply, "create").mockResolvedValue(testReply);
        const reply = await createReply(userId, discussionId, testReply.content);
        replyId = reply.id;

        vi.spyOn(prisma.reply, "delete").mockResolvedValue(testReply);
        await deleteReply(replyId);

        vi.spyOn(prisma.reply, "findMany").mockResolvedValue([]);
        const replies = await getReplyHeads(userId);
        expect(replies.some((r) => r.id === replyId)).toBe(false);
    });
});
