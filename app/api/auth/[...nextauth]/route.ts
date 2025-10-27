import { PrismaClient } from '@/generated/prisma'
import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt"

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.PRISMA_DATABASE_URL
        }
    }
})

const handler = NextAuth({
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/auth/login'
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",

            credentials: {
                email: {},
                password: {}
            },

            async authorize(credentials) {
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials?.email
                    }
                })

                const passwordIsCorrect = await compare(
                    credentials?.password || '',
                    user?.password || ''
                )

                if (passwordIsCorrect && user?.id && user?.email){
                    return {
                        id: String(user.id),
                        email: user.email
                    }
                }

                return null
            }
        })
    ]    
})

export { handler as GET, handler as POST }