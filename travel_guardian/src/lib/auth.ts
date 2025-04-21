import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail, findUserByUsername } from '../model/user';
import type { user as User } from '@prisma/client'; 
import { createSession } from './session';

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

  return createUser(
    email.trim(),
    username.trim(),
    hashedPassword,
    firstName.trim(),
    lastName.trim()
  );
}

export async function loginUser(
  identifier: string,
  password: string
): Promise<User | {error: string}> {
  const trimmedPassword = password.trim();
  const normalizedIdentifier = identifier.trim(); 

  const user =
    (await findUserByEmail(normalizedIdentifier)) ??
    (await findUserByUsername(normalizedIdentifier));

  if (!user) {
    return {error: "User does not exist"};
  }

  const safeUser = user as User;

  const isMatch = await verifyPassword(trimmedPassword, safeUser.password);

  if (!isMatch) {
    return {error: "Invalid credentials"};
  }

  await createSession(safeUser.id, safeUser.username);
  return safeUser;
}
