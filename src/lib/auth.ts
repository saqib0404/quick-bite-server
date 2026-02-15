import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";


// Build trusted origins array for cross-domain cookie handling
const trustedOriginsList = [
    process.env.APP_URL, // Local development
    process.env.PROD_APP_URL, // Production frontend
    process.env.FRONTEND_URL, // Additional frontend URL
].filter(Boolean) as string[];

// Add Vercel preview deployment URLs if applicable
if (process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "production") {
    trustedOriginsList.push("https://*.vercel.app");
}

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etcc
    }),
    trustedOrigins: trustedOriginsList,
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "CUSTOMER",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            },
            businessName: {
                type: "string",
                required: false,
            },
            isApproved: {
                type: "boolean",
                defaultValue: true,
                required: false,
            },
            addresses: {
                type: "json",
                required: false,
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: false
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            accessType: "offline",
            prompt: "select_account consent"
        }
    },

    // session: {
    //     cookieCache: {
    //         enabled: true,
    //         maxAge: 5 * 60, // 5 minutes
    //     },
    // },
    // advanced: {
    //     cookiePrefix: "better-auth",
    //     useSecureCookies: process.env.NODE_ENV === "production",
    //     sameSiteCookie: "none", // Allow cross-domain cookies for Vercel deployments
    //     crossSubDomainCookies: {
    //         enabled: true, // Enable for cross-domain cookie handling
    //     },
    //     disableCSRFCheck: true, // Allow requests without Origin header (Postman, mobile apps, etc.)
    // },

    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // 5 minutes
        },
    },
    advanced: {
        cookiePrefix: "better-auth",
        useSecureCookies: process.env.NODE_ENV === "production",
        crossSubDomainCookies: {
            enabled: false,
        },
        disableCSRFCheck: true, // Allow requests without Origin header (Postman, mobile apps, etc.)
    },


});