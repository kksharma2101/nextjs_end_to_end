import NextAuthOptions from "next-auth";
// import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
// Your own logic for dealing with plaintext password strings; be careful!
// import { saltAndHashPassword } from "@/utils/password"

export const { handlers, auth } = NextAuth({
    providers: [

        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials: any): Promise<any> => {
                try {
                    await dbConnect();
                    let user = null

                    // logic to salt and hash password
                    // const pwHash = bcrypt.hash(credentials.password, 8)

                    // logic to verify if user exists
                    user = await UserModel.findOne({ $or: [{ email: credentials.email }, { username: credentials.username }] })

                    if (!user) {
                        // No user found, so this is their first attempt to login
                        // meaning this is also the place you could do registration
                        throw new Error("User not found.")
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your account before login")
                    }

                    const passCompare = await bcrypt.compare(credentials.password, user.password);

                    if (passCompare) {
                        return user
                    } else {
                        throw new Error("Password is incorrect")
                    }

                    // return user object with the their profile data
                    return user;

                } catch (error: any) {
                    throw new Error(error)
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString(); // Convert ObjectId to string
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/sign-in',
    },
});