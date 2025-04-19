
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/auth/forgotusername/route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn()
    }
  }
}));

import prisma from '@/lib/prisma';

function mockNextRequest(body: object): NextRequest {
  return {
    json: async () => body,
  } as unknown as NextRequest;
}

describe.skip('POST /api/auth/forgotusername', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if email is missing', async () => {
    const req = mockNextRequest({});
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Email is required');
  });

  it('should return 404 if no user is found', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(null);

    const req = mockNextRequest({ email: 'notfound@example.com' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe('No user found with this email address');
  });

  it('should return username if user is found', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      username: 'testuser'
    });

    const req = mockNextRequest({ email: 'test@example.com' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.username).toBe('testuser');
  });

  it('should return 500 if an error occurs', async () => {
    (prisma.user.findUnique as any).mockRejectedValue(new Error('DB error'));

    const req = mockNextRequest({ email: 'error@example.com' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe('Internal Server Error');
  });
});
