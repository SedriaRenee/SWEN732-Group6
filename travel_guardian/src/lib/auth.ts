import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { createUser, findUserByEmail, findUserByUsername } from '../model/user';
import { prisma } from '@/lib/db'; 
import type { user as User } from '@prisma/client'; 

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
): Promise<{ user: User; token: string }> {
  const trimmedPassword = password.trim();
  const normalizedIdentifier = identifier.trim(); 

  const user =
    (await findUserByEmail(normalizedIdentifier)) ||
    (await findUserByUsername(normalizedIdentifier));

  if (!user) {
    throw new Error('Invalid email or username');
  }

  const safeUser = user as User;

  const isMatch = await verifyPassword(trimmedPassword, safeUser.password);

  if (!isMatch) {
    throw new Error('Invalid password');
  }

  const token = uuidv4();
  const SESSION_DURATION_MS = 1000 * 60 * 60 * 24; // 24 hours

  await prisma.session.create({
    data: {
      token,
      userId: safeUser.id,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
    },
  });

  return { user: safeUser, token };
}
