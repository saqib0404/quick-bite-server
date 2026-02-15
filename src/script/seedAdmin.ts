import { prisma } from "../lib/prisma"
import { UserRole } from "../middlewares/auth.middleware"


async function seedAdmin() {
    try {
        const adminData = {
            name: "Admin Sir",
            email: "admin1@db.com",
            role: UserRole.ADMIN,
            password: "admin1234"
        }
        // admin check
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        })

        if (existingUser) {
            throw new Error("User exists!!")
        }

        const signUpAdmin = await fetch("https://quick-bite-server-five.vercel.app/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(adminData)
        })

        if (signUpAdmin.ok) {
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            })
        }

    } catch (error) {
        console.log(error);
    }
}

seedAdmin()