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
    trustHost: true,
    secret: process.env.AUTH_SECRET || "xandar-lab-secret-key-change-in-production",
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
        // Nodemailer({
        //     server: process.env.EMAIL_SERVER,
        //     from: process.env.EMAIL_FROM,
        // }),
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                await connectDB();
                if (!user.email) return false;

                // Mongoose safely checks if auth/google user exists
                let dbUser = await User.findOne({ email: user.email });
                if (!dbUser) {
                    const baseUsername = user.name?.replace(/\s+/g, '').toLowerCase() || `user_${Date.now()}`;
                    let username = baseUsername;

                    // Fallback to avoid Mongoose unique constraint Duplicate Key Error (E11000)
                    let nameExists = await User.findOne({ username });
                    if (nameExists) {
                        username = `${baseUsername}_${Math.floor(Math.random() * 10000)}`;
                    }

                    dbUser = await User.create({
                        username,
                        email: user.email,
                        avatarGradient: 'from-blue-500 to-cyan-500',
                        role: 'user',
                        savedProblems: [],
                        completedProblems: [],
                        savedJobs: [],
                        isProfilePublic: false,
                        reputationScore: 0,
                        sessions: [],
                    });
                }
                // Bind Mongoose attributes to NextAuth object 
                user.id = dbUser._id.toString();
                (user as any).role = dbUser.role;
                (user as any).username = dbUser.username;
                (user as any).avatarGradient = dbUser.avatarGradient;
            }
            return true;
        },
        async jwt({ token, user, trigger, session, account }) {
            // Initial sign in
            if (user) {
                if (account?.provider === "google" && user.email) {
                    await connectDB();
                    const dbUser = await User.findOne({ email: user.email });
                    if (dbUser) {
                        token.id = dbUser._id.toString();
                        token.role = dbUser.role;
                        token.username = dbUser.username;
                        token.avatarGradient = dbUser.avatarGradient;
                    }
                } else {
                    token.id = user.id
                    token.role = (user as any).role || 'user'
                    token.username = (user as any).username || ''
                    token.avatarGradient = (user as any).avatarGradient || 'from-blue-500 to-cyan-500'
                }
            }

            // Auto-recovery for mangled or legacy cached cookies
            if (!token.username && token.email) {
                await connectDB();
                const dbUser = await User.findOne({ email: token.email });
                if (dbUser) {
                    token.id = dbUser._id.toString();
                    token.role = dbUser.role;
                    token.username = dbUser.username;
                    token.avatarGradient = dbUser.avatarGradient;
                }
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
                    ; (session.user as any).username = token.username as string
                    ; (session.user as any).avatarGradient = token.avatarGradient as string
            }
            return session
        }
    },
    pages: {
        signIn: '/lab',
    }
})
