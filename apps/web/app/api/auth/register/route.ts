import { NextResponse } from "next/server";
import prisma from "@repo/db/index";
import { createUserSchema } from "../../../../lib/CreateSchema";
import { hash } from "bcryptjs";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const { email, password } = createUserSchema.parse(await request.json());
    
    const hashedPassword = await hash(password,12);
    const user=await prisma.user.create({
        data:{
            email,
            password:hashedPassword
        }
    })
  
    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error:any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          status: "error",
          message: error.issues[0]?.message ?? "Invalid registration details.",
        },
        { status: 400 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        {
          status: "fail",
          message: "user with that email already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
