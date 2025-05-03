import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Post from "@/models/post"; // Adjust the path as needed

interface Reply= {
  workerName: string;
  content: string;
  workerId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { workerName, content } = await req.json();

    if (!workerName || !content) {
      return NextResponse.json(
        { message: "Worker Name and Content are required" },
        { status: 400 }
      );
    }

    // Find the post
    const post = await Post.findById(params.postId);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Create a properly typed reply object
    const newReply: Reply = {
      workerName,
      content,
      workerId: new mongoose.Types.ObjectId(), // Or get this from auth if needed
      createdAt: new Date(), // Add timestamps if they're part of your schema
    };

    // Push the reply to the post's replies array
    post.replies.push(newReply);

    await post.save();

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error adding reply", error: message },
      { status: 500 }
    );
  }
}