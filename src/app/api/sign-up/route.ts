import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { string } from "zod";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function Post(request: NextRequest) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();

        const existingUserIsVerifyUsername = await UserModel.findOne({ username, isVerified: true });

        if (existingUserIsVerifyUsername) {
            return NextResponse.json({ message: "Username is already exists" })
        }

        const existingUserIsVerifyByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(1000 + Math.random() * 4000).toString();

        if (existingUserIsVerifyByEmail) {
            if (existingUserIsVerifyByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: 'User already exists with this email',
                    },
                    { status: 400 }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserIsVerifyByEmail.password = hashedPassword;
                existingUserIsVerifyByEmail.verifyCode = verifyCode;
                existingUserIsVerifyByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserIsVerifyByEmail.save();
            }

        } else {
            const hash = await bcrypt.hash(password, 8);
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getHours() + 1);

            const newUser = await UserModel.create({
                username,
                email,
                password: hash,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save();
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(
            email, username, verifyCode
        )
        if (!emailResponse.success) {
            return NextResponse.json({ success: false, message: emailResponse.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, message: "User register successfully, Verify your email" }, { status: 200 })

    } catch (error) {
        console.log("Error in regestring user", error)
        return NextResponse.json({ success: false, message: "Error in sign-up", error }, { status: 50 })
    }
}