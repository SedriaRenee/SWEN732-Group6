import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { createUser, findUserByEmail, findUserByUsername } from "../model/user";
import { PrismaClient, user as User} from "@prisma/client"; // 

const prisma = new PrismaClient(); 

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function verifyPassword(inputPassword: string, storedHash: string): Promise<boolean> {
  return bcrypt.compare(inputPassword, storedHash);
}

export async function registerUser(
  email: string,
  username: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<User> {
  const trimmedPassword = password.trim();
  const hashedPassword = await hashPassword(trimmedPassword);
  return createUser(email, username, hashedPassword, firstName, lastName);
}

export async function loginUser(
  identifier: string,
  password: string
): Promise<{ user: User; token: string }> {
  const trimmedPassword = password.trim();

  const user =
    (await findUserByEmail(identifier)) ||
    (await findUserByUsername(identifier));

  if (!user) {
    throw new Error("Invalid email or username");
  }

  const isMatch = await verifyPassword(trimmedPassword, user.password);

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  
  const token = uuidv4();

  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hrs
    },
  });

  return { user, token };
}