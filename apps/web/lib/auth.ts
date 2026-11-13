import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@repo/db/index";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";


export const authOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt" as const,
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" ,placeholder: "Enter your email"},
        password: { label: "Password", type: "password" ,placeholder: "Enter your password"},
      },
      async authorize(credentials: any)
       {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
             where: { email },
             select: { id: true, email: true, name: true, image: true, password: true },
        });


        if (!user?.password) {
          return null;
        }

        if(!user || !(await bcrypt.compare(password, user.password))) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
    
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
};

