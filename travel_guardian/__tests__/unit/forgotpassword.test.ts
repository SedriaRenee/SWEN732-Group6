import { describe, it, expect, vi } from 'vitest';
import { POST } from '@/app/api/auth/forgotpassword/route';
import prisma from '@/lib/prisma';
import { createMocks } from 'node-mocks-http';

vi.mock('@/lib/prisma', () => ({
  user: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
}));

describe('POST /api/auth/forgot-password', () => {
  const email = 'test@example.com';

  it('returns 400 if email is missing', async () => {
    const { req } = createMocks({
      method: 'POST',
      url: '/api/auth/forgot-password',
      body: { email: '' },
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual({ error: 'Email is required' });
  });

  it('returns 404 if no user is found', async () => {
    (prisma.user.findUnique as vi.Mock).mockResolvedValue(null);

    const { req } = createMocks({
      method: 'POST',
      url: '/api/auth/forgot-password',
      body: { email },
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data).toEqual({ error: 'User not found' });
  });

  it('returns 200 if user is found and token is generated', async () => {
    const mockUser = {
      id: 1,
      email,
      username: 'johnny',
    };

    (prisma.user.findUnique as vi.Mock).mockResolvedValue(mockUser);
    (prisma.user.update as vi.Mock).mockResolvedValue({
      ...mockUser,
      resetToken: 'mock-reset-token',
    });

    const { req } = createMocks({
      method: 'POST',
      url: '/api/auth/forgot-password',
      body: { email },
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({ message: 'Password reset email sent' });
    expect(prisma.user.update).toHaveBeenCalled();
  });

  it('returns 500 on internal server error', async () => {
    (prisma.user.findUnique as vi.Mock).mockRejectedValue(new Error('Something went wrong'));

    const { req } = createMocks({
      method: 'POST',
      url: '/api/auth/forgot-password',
      body: { email },
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data).toEqual({ error: 'Internal Server Error' });
  });
});
