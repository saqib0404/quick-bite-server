export declare const auth: import("better-auth").Auth<{
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    trustedOrigins: string[];
    user: {
        additionalFields: {
            role: {
                type: "string";
                defaultValue: string;
                required: false;
            };
            phone: {
                type: "string";
                required: false;
            };
            status: {
                type: "string";
                defaultValue: string;
                required: false;
            };
            businessName: {
                type: "string";
                required: false;
            };
            isApproved: {
                type: "boolean";
                defaultValue: true;
                required: false;
            };
            addresses: {
                type: "string";
                required: false;
            };
        };
    };
    emailAndPassword: {
        enabled: true;
        autoSignIn: false;
        requireEmailVerification: false;
    };
    socialProviders: {
        google: {
            clientId: string;
            clientSecret: string;
            accessType: "offline";
            prompt: "select_account consent";
        };
    };
    session: {
        cookieCache: {
            enabled: true;
            maxAge: number;
        };
    };
    advanced: {
        cookiePrefix: string;
        useSecureCookies: boolean;
        crossSubDomainCookies: {
            enabled: false;
        };
        disableCSRFCheck: true;
    };
}>;
//# sourceMappingURL=auth.d.ts.map