import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/password";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await comparePassword(password, user.password))) {
      return NextResponse.json({ error: "Credențiale incorecte" }, { status: 401 });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}