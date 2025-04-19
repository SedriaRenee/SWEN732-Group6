import { describe, it, expect, beforeEach, vi } from 'vitest'
import { prisma } from "@/lib/db";
import { createUser, findUserByEmail, findUserByUsername } from '@/model/user'
import { testUser } from '../constants'

vi.mock('@/lib/db');

describe('User model', () => {
  beforeEach(() => {
   
    vi.clearAllMocks()
  })

  it('createUser calls prisma.user.create with correct payload', async () => {
    vi.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);
    vi.spyOn(prisma.user, 'create').mockResolvedValue(testUser);

    const result = await createUser(
      testUser.email,
      testUser.username,
      testUser.password,
      testUser.firstName,
      testUser.lastName
    )

    expect(prisma.user.create).toHaveBeenCalledOnce()
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: testUser.email,
        username: testUser.username,
        password: testUser.password,
        first_name: testUser.firstName,
        last_name: testUser.lastName,
      },
    })
    expect(result).toEqual(testUser)
  })

  it('findUserByEmail calls prisma.user.findUnique with email filter', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(testUser)

    const result = await findUserByEmail(testUser.email)

    expect(prisma.user.findUnique).toHaveBeenCalledOnce()
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: testUser.email },
    })
    expect(result).toEqual(testUser)
  })

  it('findUserByUsername calls prisma.user.findUnique with username filter', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(testUser)

    const result = await findUserByUsername(testUser.username)

    expect(prisma.user.findUnique).toHaveBeenCalledOnce()
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: testUser.username },
    })
    expect(result).toEqual(testUser)
  })
})
