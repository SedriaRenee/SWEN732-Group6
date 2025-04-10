import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string, salt: string): string {
  return crypto
    .createHmac('sha512', salt) 
    .update(password)            
    .digest('hex');              
}

async function main() {
 
  const salt = crypto.randomBytes(16).toString('hex');
  const password = 'password123'; 
  const hashedPassword = hashPassword(password, salt); 
  
  await prisma.user.create({
    data: {
      username: 'testuser',
      email: 'testuser@example.com',
      password: hashedPassword, 
      first_name: 'Test',
      last_name: 'User',
      salt: salt, 
    },
  });

  console.log('Seed data added!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
