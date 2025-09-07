import { DefaultSession } from 'next-auth';
import { Role } from '@/lib/types/roles';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      roles: Role[];
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    roles: Role[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    roles: Role[];
  }
}
