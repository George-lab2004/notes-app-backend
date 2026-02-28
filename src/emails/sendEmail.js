import { createTransport } from "nodemailer";
import { htmlCode } from "./htmlCode.js";

export const sendEmail = async (email) => {
    const transporter = createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const info = await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Hello ✔",
        text: "",
        html: htmlCode(email),
    })
    console.log("message sent", info.messageId)
}
