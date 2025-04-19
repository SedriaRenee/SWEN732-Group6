import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper: Extract username from the URL
function getUsernameFromUrl(req: NextRequest): string | null {
  const pathname = req.nextUrl.pathname;
  if (!pathname) {
    return null;
  }
  console.log('Pathname:', pathname); // Debugging line
  const segments = pathname.split('/');
  return segments[segments.length - 1] || null;
}


async function ensureUploadsDirectory() {
  const dirPath = path.resolve('./public/uploads');
  try {
    await fs.access(dirPath); // Check if directory exists
  } catch (err) {
    await fs.mkdir(dirPath, { recursive: true }); // Create the directory if it doesn't exist
  }
}


export async function GET(req: NextRequest) {
  try {
    const username = req.nextUrl.searchParams.get('username') || "";

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    if (!formData) {
      throw new TypeError('FormData is null or undefined');
    }

    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`); 
    });

    const username = formData.get('username')?.toString() || '';
    const name = formData.get('name')?.toString() || '';
    const age = formData.get('age')?.toString() || '';
    const hometown = formData.get('hometown')?.toString() || '';
    const description = formData.get('description')?.toString() || '';
    const placesVisited = (formData.get('placesVisited')?.toString() || '').split(',').map((place) => place.trim());
    const placesToVisit = (formData.get('placesToVisit')?.toString() || '').split(',').map((place) => place.trim());
    const profilePic = formData.get('profilePic') as Blob;

    if (!username || !name || !age || !hometown || !description || !placesVisited.length || !placesToVisit.length) {
      throw new TypeError('One or more required fields are missing or invalid');
    }

    let profilePicUrl = '';

    await ensureUploadsDirectory();

    if (profilePic) {
      const imageBuffer = Buffer.from(await profilePic.arrayBuffer());
      const imageName = `${username}-profilePic-${Date.now()}.jpg`;
      const imagePath = path.resolve('./public/uploads', imageName); 

      await fs.writeFile(imagePath, imageBuffer);
      profilePicUrl = `/uploads/${imageName}`; 
    }

    // Find the user by username
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    // Update the user profile in the database
    const updatedProfile = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        name,
        age: Number(age),
        hometown,
        description,
        placesVisited,
        placesToVisit,
        profilePic: profilePicUrl || undefined,
      },
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error('Error updating user profile:', error);

   
    const errorMessage = error instanceof Error ? error.message : String(error);
    

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}