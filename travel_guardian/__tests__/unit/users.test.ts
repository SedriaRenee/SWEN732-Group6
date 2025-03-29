import prisma from "@/lib/db";
import { assert, beforeEach, describe, expect, test, vi } from "vitest";
import { testNewUser, testUser } from "../constants";
import { createUser, deleteUser, findUser, findUserByEmail, getUser, login } from "@/model/users";
import bcrypt from "bcrypt";

vi.mock("@/lib/db");

describe("User Unit Tests", () => {

    let userId: number;

    beforeEach(async () => {
        vi.clearAllMocks();

        // Mock user
        vi.spyOn(prisma.users, "findFirst").mockResolvedValue(null); // No existing user
        vi.spyOn(prisma.users, "create").mockResolvedValue(testUser); // Mock user to create
        const user = await createUser(testUser.username, testUser.email, testUser.password, testUser.first_name, testUser.last_name);
        if (user) {
            userId = user.id;
        } else {
            assert.fail("Mock user creation failed");
        }
        
    });

    test("Find User by ID", async () => {
        vi.spyOn(prisma.users, "findUnique").mockResolvedValue(testUser);
        const user = await getUser(userId);

        if (!user) {
            assert.fail("User not found")
        }
        assert.isObject(user);
        expect(user.id).toBe(userId);
        
    });

    test("Find User by Username", async () => {
        vi.spyOn(prisma.users, "findFirst").mockResolvedValue(testUser);
        const user = await findUser(testUser.username);
        
        if (!user) {
            assert.fail("User not found")
        }
        assert.isObject(user);
        expect(user.id).toBe(userId);
        expect(user.username).toBe(testUser.username);
    });

    test("Find User by Email", async () => {
        vi.spyOn(prisma.users, "findFirst").mockResolvedValue(testUser);
        const user = await findUserByEmail(testUser.email);
        
        if (!user) {
            assert.fail("User not found")
        }
        assert.isObject(user);
        expect(user.id).toBe(userId);
        expect(user.email).toBe(testUser.email);
    });

    test("Fail to Create User", async () => {
        vi.spyOn(prisma.users, "findFirst").mockResolvedValue(testNewUser); // Already existing user
        vi.spyOn(prisma.users, "create").mockResolvedValue(testNewUser);
        const user = await createUser(testNewUser.username, testNewUser.email, testNewUser.password, testNewUser.first_name, testNewUser.last_name);
        assert.isNull(user);
    });

    test("Create User", async () => {
        vi.spyOn(prisma.users, "findFirst").mockResolvedValue(null); // No existing user
        vi.spyOn(prisma.users, "create").mockResolvedValue(testNewUser);
        const user = await createUser(testNewUser.username, testNewUser.email, testNewUser.password, testNewUser.first_name, testNewUser.last_name);
        assert.isObject(user);
        expect(user!!.id).toBe(testNewUser.id);
    });

    test("Login User", async() => {
        vi.spyOn(prisma.users, "findFirst").mockResolvedValue(testUser); // Mock user found
        vi.spyOn(bcrypt, "compareSync").mockReturnValue(true); // Mock password comparison
        const tryLogin = await login(testUser.username, testUser.password);

        if (!tryLogin) {
            assert.fail("User could not be signed in");
        }
        assert.isObject(tryLogin);
    });

    test("Delete User", async () => {
        vi.spyOn(prisma.users, "findUnique").mockResolvedValue(testUser);
        vi.spyOn(prisma.users, "delete").mockResolvedValue(testUser);
        const user = await deleteUser(userId);
        
        assert.isObject(user);
        expect(user!!.id).toBe(userId);

        // Fail delete if doesn't exist
        vi.spyOn(prisma.users, "findUnique").mockResolvedValue(null);
        const deletedUser = await deleteUser(testUser.id);
        assert.isNull(deletedUser);
    });

});