import prisma from '@/lib/prisma';  

export async function GET(req: Request, { params }: { params: { username: string } }) {
  try {
    
    const { username } = params;  
    
    
    const user = await prisma.user.findUnique({
      where: { username: username },
      include: { profile: true },
    });

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
