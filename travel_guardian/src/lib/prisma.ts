
import { PrismaClient } from '@prisma/client';

declare global {
 
  var prisma: PrismaClient | undefined;
}

let client: PrismaClient;

if (process.env.NODE_ENV === 'test') {
  
  client = {} as any;
} else {
  client = global.prisma ?? new PrismaClient();
  if (process.env.NODE_ENV !== 'production') global.prisma = client;
}

export default client;
