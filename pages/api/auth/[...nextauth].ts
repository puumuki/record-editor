import { NextApiRequest, NextApiResponse } from "next";
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
      return session // The return type will match the one returned in `useSession()`
    },
    /*
    async redirect({ url, baseUrl }:{url:string, baseUrl:string}) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }*/    
  },
}

export default NextAuth(authOptions);