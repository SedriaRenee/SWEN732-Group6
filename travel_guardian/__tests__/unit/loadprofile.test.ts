import { GET } from '@/app/api/profile/[username]/route';
import { createMocks } from 'node-mocks-http';
import prisma from '@/lib/prisma';
import { describe, it, expect, vi } from 'vitest';
import { testUser } from '../constants';

vi.mock('@/lib/prisma');

describe.skip('GET /api/profile/[username]', () => {
  it('returns 400 if username is missing from URL', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/api/profile/',
    });

    const response = await GET(req as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: 'Username is required' });
  });

  it('returns 404 if user not found', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    const { req } = createMocks({
      method: 'GET',
      url: '/api/profile/testuser',
    });

    // Patch req.nextUrl for NextRequest
    req.nextUrl = new URL('http://localhost/api/profile/testuser') as any;

    const response = await GET(req as any);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: 'User not found' });
  });

  it('returns 200 and user profile if found', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      profile: {
        name: 'Test User',
        age: 25,
        hometown: 'Testville',
        description: 'Just testing.',
        placesVisited: ['Paris', 'Rome'],
        placesToVisit: ['Tokyo', 'New York'],
        profilePic: '/uploads/testuser.jpg',
      },
    };

    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(testUser);

    const { req } = createMocks({
      method: 'GET',
      url: '/api/profile/testuser',
    });

    req.nextUrl = new URL('http://localhost/api/profile/testuser') as any;

    const response = await GET(req as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.username).toBe(testUser.username);
    expect(data.first_name).toBe(testUser.first_name);
    expect(data.last_name).toBe(testUser.last_name);
  });
});
