import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import Worker from "@/models/worker";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, employeeId } = await request.json();

    await dbConnect();

    const existingWorker = await Worker.findOne({ email });
    if (existingWorker) {
      return NextResponse.json({ message: "Worker already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newWorker = new Worker({ name, email, password: hashedPassword, employeeId });
    await newWorker.save();

    return NextResponse.json({ message: "Worker created successfully" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Error creating worker", error: err }, { status: 500 });
  }
}
