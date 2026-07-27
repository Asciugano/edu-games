import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
  adapter,
});

export const auth = betterAuth({
  user: {
    additionalFields: {
      role: {
        type: ["USER", "ADMIN"],
        required: false,
        defaultValue: "USER",
        input: false,
      },
      level: {
        type: "number",
        required: false,
        defaultValue: 1,
        input: false,
      },
      coin: {
        type: "number",
        required: false,
        defaultValue: 0,
      },
      streak: {
        type: "number",
        required: false,
        defaultValue: 0,
        input: false,
      },
      totalXp: {
        type: "number",
        required: false,
        defaultValue: 0,
        input: false,
      },
      imageKey: {
        type: "string",
        required: false,
        input: true,
      },
      lastActivityAt: {
        type: "date",
        required: false,
      },
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
