import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import Nodemailer from "next-auth/providers/nodemailer"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { verifyPassword } from "@/lib/auth"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
                inviteCode: { label: "Invite Code", type: "text" },
                isSignUp: { label: "Sign Up", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.username) return null

                await connectDB()

                if (credentials.isSignUp === 'true') {
                    if (credentials.inviteCode !== process.env.NEXT_PUBLIC_INVITE_CODE) {
                        throw new Error("Invalid invite code")
                    }
                    const existing = await User.findOne({ username: credentials.username })
                    if (existing) throw new Error("Username already taken")

                    const { hashPassword } = await import('@/lib/auth')
                    const hashedPassword = credentials.password ? await hashPassword(credentials.password as string) : undefined

                    const user = await User.create({
                        username: credentials.username,
                        password: hashedPassword,
                        lastLoginAt: new Date(),
                        role: 'user',
                        sessions: [],
                    })
                    return { id: user._id.toString(), name: user.username, role: user.role }
                }

                // Login
                const user = await User.findOne({ username: credentials.username })
                if (!user || !user.password) throw new Error("Invalid credentials")

                const { verifyPassword } = await import('@/lib/auth')
                const isValid = await verifyPassword(credentials.password as string, user.password)
                if (!isValid) throw new Error("Invalid credentials")

                return {
                    id: user._id.toString(),
                    name: user.username,
                    email: user.email,
                    image: user.avatarGradient,
                    role: user.role,
                }
            }
        }),
        Nodemailer({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
        }),
    ],
    session: {
        strategy: "jwt"
    },
    events: {
        async createUser({ user }) {
            await connectDB()
            await User.findByIdAndUpdate(user.id, {
                $set: {
                    username: user.name?.replace(/\s+/g, '').toLowerCase() || `user_${Date.now()}`,
                    avatarGradient: 'from-blue-500 to-cyan-500', // default
                    role: 'user',
                    savedProblems: [],
                    completedProblems: [],
                    savedJobs: [],
                }
            })
        }
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id
                token.role = user.role || 'user'
            }
            if (trigger === "update" && session) {
                token = { ...token, ...session }
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as 'user' | 'pro' | 'contributor' | 'moderator' | 'admin'
            }
            return session
        }
    },
    pages: {
        signIn: '/lab', // since we have the modal on /lab
    }
})
