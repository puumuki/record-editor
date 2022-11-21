import NextAuth, { Session } from "next-auth"
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || ''
    })
  ],
  callbacks: {
    session({ session }: {session:Session}) {
      
      if( session.user.email === 'teemuki@gmail.com' ) {        
        session.user.role = 'admin';
      }

      return session; // The return type will match the one returned in `useSession()`
    },
  }
}

export default NextAuth(authOptions);