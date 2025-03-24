import { test, describe, beforeAll, afterAll, beforeEach, afterEach, expect } from "vitest";
import { PrismaClient } from "@prisma/client";
import { createDiscussion, getAllDiscussions, getDiscussions, updateDiscussion, deleteDiscussion } from "@/model/discussions";

const prisma = new PrismaClient();

beforeAll(async () => {
    await prisma.$connect();
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe("Discussion Service Tests", () => {
    let userId: number;
    let locationId: number;
    let discussionId: number;

    beforeEach(async () => {
        // Create a test location
        const location = await prisma.location.create({
            data: { name: "Test Location", lat: "40.7128", lon: "-74.0060", type: "city" },
        });
        locationId = location.id;

        // Create a test user
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
    });

    afterEach(async () => {
        await prisma.discussions.deleteMany();
        await prisma.users.deleteMany();
        await prisma.location.deleteMany();
    });

    test("Create a new discussion", async () => {
        const discussion = await createDiscussion("Test Title", "Test Content", userId, locationId);
        discussionId = discussion.id;

        expect(discussion).toHaveProperty("id");
        expect(discussion.title).toBe("Test Title");
    });

    test("Get discussions by location", async () => {
        await createDiscussion("Test Title", "Test Content", userId, locationId);

        const discussions = await getAllDiscussions(locationId);
        expect(discussions.length).toBeGreaterThan(0);
        expect(discussions[0].locationId).toBe(locationId);
    });

    test("Get a single discussion by ID", async () => {
        const discussion = await createDiscussion("Test Title", "Test Content", userId, locationId);
        discussionId = discussion.id;

        const fetchedDiscussion = await getDiscussions(discussionId);
        expect(fetchedDiscussion).not.toBeNull();
        expect(fetchedDiscussion?.id).toBe(discussionId);
    });

    test("Update a discussion", async () => {
        const discussion = await createDiscussion("Old Title", "Old Content", userId, locationId);
        discussionId = discussion.id;

        const updatedDiscussion = await updateDiscussion(discussionId, "New Title", "New Content");
        expect(updatedDiscussion.title).toBe("New Title");
    });

    test("Delete a discussion", async () => {
        const discussion = await createDiscussion("To be deleted", "Some content", userId, locationId);
        discussionId = discussion.id;

        await deleteDiscussion(discussionId);
        const deletedDiscussion = await getDiscussions(discussionId);
        expect(deletedDiscussion).toBeNull();
    });
});

