import { describe, it, expect, vi, Mock } from 'vitest';
import { POST } from '@/app/api/auth/forgotpassword/route';
import { prisma } from "@/lib/db";
import { createMocks } from 'node-mocks-http';
import { testUser } from '../constants';

vi.mock('@/lib/prisma');

describe.skip('POST /api/auth/forgotpassword', () => {
  const email = 'test@example.com';

  it('returns 400 if email is missing', async () => {
    const { req } = createMocks({
      method: 'POST',
      url: '/api/auth/forgotpassword',
      body: { email: '' },
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual({ error: 'Email is required' });
  });
  
  it('returns 404 if no user is found', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    const { req } = createMocks({
      method: 'POST',
      url: '/api/auth/forgotpassword',
      body: { email },
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data).toEqual({ error: 'User not found' });
  });

  it('returns 200 if user is found and token is generated', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(testUser);
    vi.spyOn(prisma.user, 'update').mockResolvedValue({
      ...testUser,
      resetToken: 'mock-reset-token'});

    const { req } = createMocks({
      method: 'POST',
      url: '/api/auth/forgotpassword',
      body: { email },
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({ message: 'Password reset email sent' });
    expect(prisma.user.update).toHaveBeenCalled();
  });

  it('returns 500 on internal server error', async () => {
    (prisma.user.findUnique as Mock).mockRejectedValue(new Error('Something went wrong'));

    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(testUser);
    const { req } = createMocks({
      method: 'POST',
      url: '/api/auth/forgotpassword',
      body: { email },
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data).toEqual({ error: 'Internal Server Error' });
  });
});
