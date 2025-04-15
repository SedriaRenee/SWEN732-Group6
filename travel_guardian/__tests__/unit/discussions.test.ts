import { test, describe, beforeEach, afterEach, expect, vi } from "vitest";
import { createDiscussion, getAllDiscussions, getDiscussions, updateDiscussion, deleteDiscussion } from "@/model/discussions";
import prisma from "@/lib/db";
import { testCity, testDiscussion, testUser } from "../constants";
import { createLocation } from "@/model/location";

vi.mock("@/lib/db");

describe("Discussion Service Tests ", () => {
    let userId: number;
    let locationId: number;

    beforeEach(async () => {
        vi.clearAllMocks();
        // Mock Location Creation
        vi.spyOn(prisma.location, "create").mockResolvedValue(testCity);
        const loc = await createLocation(testCity.name, "");
        locationId = loc.id;


        // Mock User Creation
        vi.spyOn(prisma.user, "create").mockResolvedValue(testUser);
        const user = await prisma.user.create({data: testUser });
        userId = user.id;
    });

    test("Create a new discussion", async () => {
        vi.spyOn(prisma.discussions, "create").mockResolvedValue(testDiscussion);
        const discussion = await createDiscussion(testDiscussion.title, testDiscussion.content, userId, locationId);
        expect(discussion.id).toBeDefined();
        expect(discussion.title).toBe(testDiscussion.title);
    });

    test("Get discussions by location", async () => {
        vi.spyOn(prisma.discussions, "create").mockResolvedValue(testDiscussion);
        const discussion = await createDiscussion(testDiscussion.title, testDiscussion.content, userId, locationId);
        vi.spyOn(prisma.discussions, "findMany").mockResolvedValue([discussion]);
        const discussions = await getAllDiscussions(locationId);

        expect(discussions.length).toBeGreaterThan(0);
        expect(discussions[0].locationId).toBe(locationId);
    });

    test("Get a single discussion by ID (should return null for non-existent ID)", async () => {
        vi.spyOn(prisma.discussions, "findUnique").mockResolvedValue(null);
        const fetchedDiscussion = await prisma.discussions.findUnique({where: {id: 1}});
        expect(fetchedDiscussion).toBeNull();
    });

    test("Get a single discussion by ID (should return the correct discussion)", async () => {
        vi.spyOn(prisma.discussions, "create").mockResolvedValue(testDiscussion);
        const discussion = await createDiscussion(testDiscussion.title, testDiscussion.content, userId, locationId);
        vi.spyOn(prisma.discussions, "findUnique").mockResolvedValue(discussion);
        const fetchedDiscussion = await getDiscussions(discussion.id);

        expect(fetchedDiscussion).not.toBeNull();
        expect(fetchedDiscussion?.id).toBe(discussion.id);
    });

    test("Update a discussion", async () => {
        vi.spyOn(prisma.discussions, "create").mockResolvedValue(testDiscussion);
        const discussion = await createDiscussion("Old Title", "Old Content", userId, locationId);
        vi.spyOn(prisma.discussions, "update").mockResolvedValue({ ...discussion, title: "New Title" });
        const updatedDiscussion = await updateDiscussion(discussion.id, "New Title", "New Content");

        expect(updatedDiscussion.title).toBe("New Title");
    });

    test("Delete a discussion", async () => {
        vi.spyOn(prisma.discussions, "create").mockResolvedValue(testDiscussion);
        const discussion = await createDiscussion("To be deleted", "Some content", userId, locationId);
        vi.spyOn(prisma.discussions, "delete").mockResolvedValue(discussion);
        await deleteDiscussion(discussion.id);

        vi.spyOn(prisma.discussions, "findUnique").mockResolvedValue(null);
        const deletedDiscussion = await getDiscussions(discussion.id);
        expect(deletedDiscussion).toBeNull();
    });
});
