import {prismaMock} from "./__mocks__/prismaMocks";
import { test, describe, beforeEach, afterEach, expect, vi } from "vitest";
import { createDiscussion, getAllDiscussions, getDiscussions, updateDiscussion, deleteDiscussion } from "@/model/discussions";


describe("Discussion Service Tests ", () => {
    let userId: number;
    let locationId: number;

    beforeEach(() => {
        // Mock Location Creation
        prismaMock.location.create({
            data:{
            id: 1,
            name: "Test Location",
            lat: "40.7128",
            lon: "-74.0060",
            type: "city",
            }
        });
        locationId = 1;

        // Mock User Creation
        prismaMock.users.create({
            data:{
            id: 1,
            username: "testuser",
            email: "test@example.com",
            password: "password123",
            first_name: "Test",
            last_name: "User",
            type: "travler",
            }
        });
        userId = 1;
    });

    afterEach(async () => {
        await prismaMock.discussions.delete({where: {id: 1}});
        vi.resetAllMocks();
    });

    test("Create a new discussion", async () => {
        const discussion = await createDiscussion("Test Title", "Test Content", userId, locationId);
        expect(discussion).toHaveProperty("id");
        expect(discussion.title).toBe("Test Title");
    });

    test("Get discussions by location", async () => {
        await createDiscussion("Test Title", "Test Content", userId, locationId);
        const discussions = await getAllDiscussions(locationId);

        expect(discussions.length).toBeGreaterThan(0);
        expect(discussions[0].locationId).toBe(locationId);
    });

    test("Get a single discussion by ID (should return null for non-existent ID)", async () => {
        //const fetchedDiscussion = await getDiscussions(1);
        const fetchedDiscussion = await prismaMock.discussions.findUnique({where: {id: 1}});
        console.log(fetchedDiscussion);
        expect(fetchedDiscussion).toBeNull();
    });

    test("Get a single discussion by ID (should return the correct discussion)", async () => {
        const discussion = await createDiscussion("Test Title", "Test Content", userId, locationId);
        const fetchedDiscussion = await getDiscussions(discussion.id);

        expect(fetchedDiscussion).not.toBeNull();
        expect(fetchedDiscussion?.id).toBe(discussion.id);
    });

    test("Update a discussion", async () => {
        const discussion = await createDiscussion("Old Title", "Old Content", userId, locationId);
        const updatedDiscussion = await updateDiscussion(discussion.id, "New Title", "New Content");

        expect(updatedDiscussion.title).toBe("New Title");
    });

    test("Delete a discussion", async () => {
        const discussion = await createDiscussion("To be deleted", "Some content", userId, locationId);
        await deleteDiscussion(discussion.id);

        const deletedDiscussion = await getDiscussions(discussion.id);
        expect(deletedDiscussion).toBeNull();
    });
});
