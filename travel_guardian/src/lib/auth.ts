import bcrypt from "bcryptjs";
import { findUserByEmail, findUserByUsername, createUser } from "../model/user";

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function verifyPassword(
  inputPassword: string,
  storedHash: string
): Promise<boolean> {
  return bcrypt.compare(inputPassword, storedHash);
}

export async function registerUser(
  email: string,
  username: string,
  password: string,
  firstName: string,
  lastName: string
) {
  const trimmedPassword = password.trim();

  const hashedPassword = await hashPassword(trimmedPassword);

  return createUser(email, username, hashedPassword, firstName, lastName);
}

export async function loginUser(identifier: string, password: string) {
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

  return user;
}
