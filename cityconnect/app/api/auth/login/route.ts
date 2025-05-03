import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Worker from "@/models/worker";
import { setTokenCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password, employeeId, userType } = await request.json();

    if (!email || !password || (userType === "department" && !employeeId)) {
      return NextResponse.json({ message: "Please fill all the fields" }, { status: 400 });
    }

    await dbConnect();

    const existingWorker = await Worker.findOne({ email });
    if (!existingWorker) {
      return NextResponse.json({ message: "Worker not found" }, { status: 400 });
    }

    if (userType === "department" && existingWorker.employeeId !== employeeId) {
      return NextResponse.json({ message: "Invalid Employee ID" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, existingWorker.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid Password" }, { status: 400 });
    }

    const token = jwt.sign({ id: existingWorker._id, email }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "1h",
    });

    setTokenCookie(token); // Securely sets token in cookie

    return NextResponse.json({
      message: "Login successful",
      token,
      userId: existingWorker._id,
      name: existingWorker.name,
      employeeId: existingWorker.employeeId,
    });
  } catch (err) {
    return NextResponse.json({ message: "Login failed", error: err }, { status: 500 });
  }
}
