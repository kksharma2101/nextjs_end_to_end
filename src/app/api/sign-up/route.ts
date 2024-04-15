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
            return NextResponse.json({ message: "Email is already exists" })
        }
        let hash = bcrypt.hashSync('bacon', 8);
        const user = await UserModel.create({ username, email, password: hash })

        return NextResponse.json({ success: true, message: "User sign-up successfully" }, { status: 200 })

    } catch (error) {
        console.log("Error in regestring user", error)
        return NextResponse.json({ success: false, message: "Error in sign-up", error }, { status: 50 })
    }
}