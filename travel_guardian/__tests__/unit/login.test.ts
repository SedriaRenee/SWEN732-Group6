
import { POST } from '@/app/api/auth/login/route';  
import { loginUser } from '@/lib/auth';
import { NextRequest } from 'next/server';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  loginUser: vi.fn(),
}));

describe.skip('POST /api/auth/login', () => {
  const mockUser = {
    id: 42,
    username: 'johndoe',
    email: 'john@example.com',
    
  };

  it('returns 200 + user + token on successful login', async () => {

    /*(loginUser as vi.Mock).mockResolvedValue({
      user: mockUser,
      token: 'mock-token',
    });*/

    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'johndoe', password: 'password123' }),
    });

    // Act
    const res = await POST(req);
    const data = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(data.user).toEqual(mockUser);
    expect(data.token).toBe('mock-token');
  });

  it('returns 400 on invalid credentials', async () => {
    
    //(loginUser as vi.Mock).mockRejectedValue(new Error('Invalid credentials'));

    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'wrong', password: 'bad' }),
    });

    // Act
    const res = await POST(req);
    const data = await res.json();

    // Assert
    expect(res.status).toBe(400);
    expect(data.error).toBe('Invalid credentials');
  });
});
