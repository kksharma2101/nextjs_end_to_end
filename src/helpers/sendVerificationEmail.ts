import { resend } from "@/lib/resendEmail";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(email: string, verifyCode: string, username: string): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Hello World',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        return { success: true, message: "verification email send successfully" }
    } catch (emailError) {
        console.log("Error in send verification email");
        return { success: false, message: "Failed to send verification email" }
    }
}