import { vi } from "vitest";
import {discussions, location, users, reply, report} from "@prisma/client";

// In-memory storage for mock data
export const discussionsMock: discussions[] = [];
export const usersMock: users[] = [];
export const locationsMock: location[] = [];
export const repliesMock: reply[] = [];
export const reportsMock: report[] = [];

export const prismaMock = {
    users: {
        create: vi.fn(async ({ data }) => {
            const newUser: users = {
                id: usersMock.length + 1,
                ...data,
            };
            usersMock.push(newUser);
            return newUser;
        }),
        findUnique: vi.fn(async ({ where }) => usersMock.find((u) => u.id === where.id) || null),
        delete: vi.fn(async ({ where }) => {
            const index = usersMock.findIndex((u) => u.id === where.id);
            return index !== -1 ? usersMock.splice(index, 1)[0] : null;
        }),
    },
    location: {
        create: vi.fn(async ({ data }) => {
            const newLocation: location = {
                id: locationsMock.length + 1,
                ...data,
                parentId: data.parentId || null,
            };
            locationsMock.push(newLocation);
            return newLocation;
        }),
        findUnique: vi.fn(async ({ where }) => locationsMock.find((l) => l.id === where.id) || null),
        delete: vi.fn(async ({ where }) => {
            const index = locationsMock.findIndex((l) => l.id === where.id);
            return index !== -1 ? locationsMock.splice(index, 1)[0] : null;
        }),
    },
    discussions: {
        create: vi.fn(async ({ data }) => {
            const newDiscussion: discussions = {
                id: discussionsMock.length + 1,
                ...data,
                created_at: new Date()
            };
            discussionsMock.push(newDiscussion);
            return newDiscussion;
        }),
        findUnique: vi.fn(async ({ where }) => discussionsMock.find((d) => d.id === where.id) || null),
        findMany: vi.fn(async ({ where }) => discussionsMock.filter((d) => d.locationId === where.locationId)),
        update: vi.fn(async ({ where, data }) => {
            const discussion = discussionsMock.find((d) => d.id === where.id);
            if (!discussion) return null;
            Object.assign(discussion, data);
            return discussion;
        }),
        delete: vi.fn(async ({ where }) => {
            const index = discussionsMock.findIndex((d) => d.id === where.id);
            return index !== -1 ? discussionsMock.splice(index, 1)[0] : null;
        }),
    },
    reply: {
        create: vi.fn(async ({ data }) => {
            const newReply: reply = {
                id: repliesMock.length + 1,
                ...data,
                created_at: new Date(), // Ensure timestamp is set
                discussionId: data.discussionId || null,
                parentId: data.parentId || null,
            };
            repliesMock.push(newReply);
            return newReply;
        }),
        findMany: vi.fn(async ({ where }) => repliesMock.filter((r) => r.creatorId === where.creatorId)),
        update: vi.fn(async ({ where, data }) => {
            const reply = repliesMock.find((r) => r.id === where.id);
            if (!reply) return null;
            Object.assign(reply, data);
            return reply;
        }),
        delete: vi.fn(async ({ where }) => {
            const index = repliesMock.findIndex((r) => r.id === where.id);
            return index !== -1 ? repliesMock.splice(index, 1)[0] : null;
        }),
    },
    report: {
        create: vi.fn(async ({ data }) => {
            const newReport: report = {
                id: reportsMock.length + 1,
                ...data,
                created: new Date()
            };
            reportsMock.push(newReport);
            return newReport;
        }),
        findMany: vi.fn(async ({ where }) => reportsMock.filter((r) => r.locId === where.locId)),
        findManyTag: vi.fn(async ({where}) => reportsMock.filter((r) => r.tag === where.tag)),
        delete: vi.fn(async ({ where }) => {
            const index = reportsMock.findIndex((r) => r.id === where.id);
            return index !== -1 ? reportsMock.splice(index, 1)[0] : null;
        }),
    },
};

// Mock Prisma Client
vi.mock("@prisma/client", () => ({
    PrismaClient: vi.fn(() => prismaMock),
}));
