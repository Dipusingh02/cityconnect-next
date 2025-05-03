import { NextResponse } from "next/server";
import Post from "@/models/post"; 
export async function GET() {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching posts", error }, { status: 500 });
  }
}
