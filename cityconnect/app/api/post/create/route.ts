import { NextRequest, NextResponse } from "next/server";
import Post from "@/models/post";  // Adjust the path as necessary

export async function POST(req: NextRequest) {
  try {
    const { title, author, department, content, accessLevel } = await req.json();

    if (!author) {
      return NextResponse.json({ message: "Author is required" }, { status: 400 });
    }

    const newPost = new Post({ title, author, department, content, accessLevel, replies: [] });
    await newPost.save();

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating post", error }, { status: 500 });
  }
}
