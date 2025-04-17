import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function updateUserProfileInDB(
  username: string,
  name: string,
  age: string,
  hometown: string,
  description: string,
  placesVisited: string[],
  placesToVisit: string[],
  profilePicUrl: string
) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return prisma.profile.update({
    where: { userId: user.id },
    data: {
      name,
      age: parseInt(age, 10), 
      hometown,
      description,
      placesVisited,
      placesToVisit,
      profilePic: profilePicUrl,
    },
  });
}


export async function getUserProfileFromDB(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      profile: true, 
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user.profile; 
}