import { POST } from '@/app/api/auth/reset-password/route';
import { createMocks } from 'node-mocks-http';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { describe, it, expect, vi } from 'vitest';


vi.mock('@/lib/prisma', () => ({
  user: {
    findFirst: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('bcryptjs', () => ({
  hash: vi.fn(),
}));

describe('POST /api/auth/reset-password', () => {
  it('returns 400 if token or new password is missing', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      url: '/api/auth/reset-password',
      body: { token: '', newPassword: '' }, // Missing token and password
    });

    const response = await POST(req as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: 'Missing token or password' });
  });

  it('returns 400 if token is invalid or expired', async () => {
    (prisma.user.findFirst as vi.Mock).mockResolvedValue(null); // Simulate no user found

    const { req, res } = createMocks({
      method: 'POST',
      url: '/api/auth/reset-password',
      body: { token: 'invalid-token', newPassword: 'newpassword' },
    });

    const response = await POST(req as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: 'Invalid or expired token' });
  });

  it('successfully resets the password when valid token is provided', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      resetToken: 'valid-token',
      resetTokenExpiry: new Date(Date.now() + 100000), 
    };

    (prisma.user.findFirst as vi.Mock).mockResolvedValue(mockUser); 
    (bcrypt.hash as vi.Mock).mockResolvedValue('hashedPassword'); 
    (prisma.user.update as vi.Mock).mockResolvedValue({ ...mockUser, password: 'hashedPassword' });

    const { req, res } = createMocks({
      method: 'POST',
      url: '/api/auth/reset-password',
      body: { token: 'valid-token', newPassword: 'newpassword' },
    });

    const response = await POST(req as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ message: 'Password successfully reset.' });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: {
        password: 'hashedPassword',
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
  });

  it('returns 500 if an error occurs during password reset', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      url: '/api/auth/reset-password',
      body: { token: 'valid-token', newPassword: 'newpassword' },
    });

    (prisma.user.findFirst as vi.Mock).mockRejectedValue(new Error('Database error')); // database error

    const response = await POST(req as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Internal Server Error' });
  });
});
