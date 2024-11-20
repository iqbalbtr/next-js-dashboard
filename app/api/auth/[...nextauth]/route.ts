import bcrypt from "bcrypt"
import NextAuth, { User } from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import db from '@/db';
import { authTable, userTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import validate from "@/validations";
import { loginUserSchema } from "@/validations/auth";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                

                const existingUser = await db.query.userTable.findFirst({
                    where: (user, { eq }) => (eq(user.email, credentials?.email!))
                })

                if (!existingUser)
                    return null

                const verify = bcrypt.compareSync(credentials?.password!, existingUser.password!)

                if (!verify)
                    return null

                await db.update(authTable).set({
                    lastLogged: new Date(),
                }).where(eq(authTable.id, existingUser.id))

                return {
                    id: existingUser.id.toString(),
                    name: existingUser.name,
                    email: existingUser.email,
                    image: ""
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email as string;
                token.name = user.name as string;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name!;
                session.user.email = token.email!;
            }
            return session;
        },
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                await db.transaction(async (trx) => {
                    const existingUser = await trx.query.userTable.findFirst({
                        where: (tbUser, { eq }) => eq(tbUser.email, user.email as string),
                    });

                    if (existingUser) {
                        await trx.update(authTable)
                            .set({ lastLogged: new Date() })
                            .where(eq(authTable.userId, existingUser.id));

                        user.id = existingUser.id.toString();
                    } else {
                        const newUser = await trx.insert(userTable)
                            .values({
                                name: user.name || "user",
                                password: null,
                                email: user.email as string,
                            })
                            .returning();

                        await trx.insert(authTable)
                            .values({
                                userId: newUser[0].id,
                                isVerify: false,
                                lastLogged: new Date(),
                            });

                        user.id = newUser[0].id.toString()
                    }
                });

                return true;
            }

            return true;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.AUTH_SECRET || "",
});

export { handler as GET, handler as POST };
