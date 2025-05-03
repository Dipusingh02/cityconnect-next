import { NextResponse,NextRequest } from "next/server";
import Post from "@/models/post";
export async function DELETE(req: NextRequest, { params }: { params: { postId: string, replyId: string } }) {
  try {
    const post = await Post.findById(params.postId);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    post.replies = post.replies.filter(reply => reply._id.toString() !== params.replyId);
    await post.save();

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ message: "Error deleting reply", error }, { status: 500 });
  }
}
