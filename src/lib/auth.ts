import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

// Type safety for session and user
declare module "next-auth" {
    interface Session
    {
        user: {
            id: string
            name?: string | null
            email?: string | null
            image?: string | null
            level?: number | null
            points?: number | null
        }
    }

    interface User
    {
        id: string
        name?: string | null
        email?: string | null
        level?: number | null
        points?: number | null
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials)
            {
                try
                {
                    if (!credentials?.email || !credentials?.password)
                    {
                        return null
                    }

                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            password: true,
                            level: true,
                            points: true
                        }
                    })

                    if (!user)
                    {
                        return null
                    }

                    const passwordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if (!passwordValid)
                    {
                        return null
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        level: user.level,
                        points: user.points
                    }
                } catch (error)
                {
                    console.error('Auth error:', error)
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user })
        {
            if (user)
            {
                token.id = user.id
                token.level = user.level
                token.points = user.points
            }
            return token
        },
        async session({ session, token })
        {
            if (token && session.user)
            {
                session.user.id = token.id as string
                session.user.level = token.level as number
                session.user.points = token.points as number
            }
            return session
        }
    },
    debug: process.env.NODE_ENV === 'development',
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
        error: '/login',
    }
}