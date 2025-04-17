// __tests__/unit/signup.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// 1️⃣ Mock _before_ importing the handler
vi.mock('@/lib/auth', () => ({
  registerUser: vi.fn(),
}));
vi.mock('@/lib/session', () => ({
  createSession: vi.fn(),
}));

// 2️⃣ Now import what you need
import { POST } from '@/app/api/auth/signup/route';
import { registerUser } from '@/lib/auth';
import { createSession } from '@/lib/session';

describe('POST /api/auth/signup', () => {
  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    password: 'hashed',
  };

  const requestBody = {
    email: 'test@example.com',
    username: 'testuser',
    password: 'secret123',
    firstName: 'Test',
    lastName: 'User',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should register user and create session successfully', async () => {
    // 3️⃣ Tell our mocks what to do
    (registerUser as vi.Mock).mockResolvedValue(mockUser);
    (createSession as vi.Mock).mockResolvedValue(undefined);

    // 4️⃣ Build a Request with JSON body AND header
    const req = new Request('http://localhost/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    // 5️⃣ Call handler
    const res = await POST(req);
    const json = await res.json();

    // 6️⃣ Assert
    expect(registerUser).toHaveBeenCalledTimes(1);
    expect(registerUser).toHaveBeenCalledWith(
      requestBody.email,
      requestBody.username,
      requestBody.password,
      requestBody.firstName,
      requestBody.lastName
    );

    expect(createSession).toHaveBeenCalledTimes(1);
    expect(createSession).toHaveBeenCalledWith(mockUser.id, mockUser.username);

    expect(res.status).toBe(201);
    expect(json).toEqual({
      message: 'Signup successful',
      user: mockUser,
    });
  });

  it('should return 400 if registerUser throws', async () => {
    (registerUser as vi.Mock).mockRejectedValue(new Error('User exists'));

    const req = new Request('http://localhost/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(registerUser).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(json).toEqual({ error: 'User exists' });
  });
});
