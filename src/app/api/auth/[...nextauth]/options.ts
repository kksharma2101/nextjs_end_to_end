import NextAuthOptions from "next-auth";
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "domain-login",
            name: "Domain Account",
            async authorize(credentials, req) {
                const user = {
                    /* add function to get user */
                }
                return user
            }
        }),
    ]
}