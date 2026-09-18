import NextAuth, { CredentialsSignin } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import Nodemailer from "next-auth/providers/nodemailer"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { verifyPassword } from "@/lib/auth"

const DEFAULT_ADMIN_USERNAMES = ['vedant', 'vedantlahane', 'val', 'admin'];
const DEFAULT_ADMIN_EMAILS = ['vedantanillahane@gmail.com', 'vedantlahane38591@gmail.com'];

export function isDefaultAdmin(username?: string | null, email?: string | null): boolean {
    if (username && DEFAULT_ADMIN_USERNAMES.includes(username.toLowerCase())) return true;
    if (email && DEFAULT_ADMIN_EMAILS.includes(email.toLowerCase())) return true;
    const envAdmins = process.env.ADMIN_USERNAMES?.split(',').map(s => s.trim().toLowerCase()) || [];
    if (username && envAdmins.includes(username.toLowerCase())) return true;
    const envEmails = process.env.ADMIN_EMAILS?.split(',').map(s => s.trim().toLowerCase()) || [];
    if (email && envEmails.includes(email.toLowerCase())) return true;
    return false;
}

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
                try {
                    if (!credentials?.username) return null

                    await connectDB()

                    const usernameStr = credentials.username as string;
                    const isOwnerAdmin = isDefaultAdmin(usernameStr, null);

                    if (credentials.isSignUp === 'true') {
                        const expectedCode = process.env.NEXT_PUBLIC_INVITE_CODE || process.env.INVITE_CODE || '7447';
                        if (credentials.inviteCode !== expectedCode) {
                            throw new CredentialsSignin("Invalid invite code")
                        }
                        const existing = await User.findOne({ username: credentials.username })
                        if (existing) throw new CredentialsSignin("Username already taken")

                        const { hashPassword } = await import('@/lib/auth')
                        const hashedPassword = credentials.password ? await hashPassword(credentials.password as string) : undefined

                        const user = await User.create({
                            username: credentials.username,
                            password: hashedPassword,
                            lastLoginAt: new Date(),
                            role: isOwnerAdmin ? 'admin' : 'user',
                            sessions: [],
                        })
                        return { id: user._id.toString(), name: user.username, role: user.role }
                    }

                    // Login
                    const user = await User.findOne({ username: credentials.username })
                    if (!user || !user.password) throw new CredentialsSignin("Invalid credentials")

                    const { verifyPassword } = await import('@/lib/auth')
                    const isValid = await verifyPassword(credentials.password as string, user.password)
                    if (!isValid) throw new CredentialsSignin("Invalid credentials")

                    if (isOwnerAdmin && user.role !== 'admin') {
                        user.role = 'admin';
                        await user.save();
                    }

                    return {
                        id: user._id.toString(),
                        name: user.username,
                        email: user.email,
                        image: user.avatarGradient,
                        role: isOwnerAdmin ? 'admin' : (user.role || 'user'),
                    }
                } catch (e: any) {
                    console.error("AUTHORIZE ERROR:", e)
                    const fs = require('fs')
                    fs.writeFileSync('error_log.txt', e.stack || e.toString())
                    throw e
                }
            }
        }),
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                await connectDB();
                if (!user.email) return false;

                const isOwnerAdmin = isDefaultAdmin(user.name, user.email);

                let dbUser = await User.findOne({ email: user.email });
                if (!dbUser) {
                    const baseUsername = user.name?.replace(/\s+/g, '').toLowerCase() || `user_${Date.now()}`;
                    let username = baseUsername;

                    let nameExists = await User.findOne({ username });
                    if (nameExists) {
                        username = `${baseUsername}_${Math.floor(Math.random() * 10000)}`;
                    }

                    dbUser = await User.create({
                        username,
                        email: user.email,
                        avatarGradient: 'from-blue-500 to-cyan-500',
                        role: isOwnerAdmin ? 'admin' : 'user',
                        savedProblems: [],
                        completedProblems: [],
                        savedJobs: [],
                        isProfilePublic: false,
                        reputationScore: 0,
                        sessions: [],
                    });
                } else if (isOwnerAdmin && dbUser.role !== 'admin') {
                    dbUser.role = 'admin';
                    await dbUser.save();
                }

                user.id = dbUser._id.toString();
                (user as any).role = isOwnerAdmin ? 'admin' : (dbUser.role || 'user');
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
                        token.role = isDefaultAdmin(dbUser.username, dbUser.email) ? 'admin' : (dbUser.role || 'user');
                        token.username = dbUser.username;
                        token.avatarGradient = dbUser.avatarGradient;
                    }
                } else {
                    token.id = user.id
                    token.role = isDefaultAdmin((user as any).username || user.name, (user as any).email)
                        ? 'admin'
                        : ((user as any).role || 'user')
                    token.username = (user as any).username || user.name || ''
                    token.avatarGradient = (user as any).avatarGradient || 'from-blue-500 to-cyan-500'
                }
            }

            if (!token.username && token.name) {
                token.username = token.name;
            }

            // Always enforce default admin on token
            if (isDefaultAdmin(token.username as string, token.email as string)) {
                token.role = 'admin';
            }

            if (trigger === "update" && session) {
                token = { ...token, ...session }
                if (isDefaultAdmin(token.username as string, token.email as string)) {
                    token.role = 'admin';
                }
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                const isAdminUser = isDefaultAdmin(token.username as string, token.email as string);
                session.user.id = token.id as string
                session.user.role = (isAdminUser ? 'admin' : (token.role || 'user')) as 'user' | 'pro' | 'contributor' | 'moderator' | 'admin'
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
