import mongoose, { Document, Model } from "mongoose";

export interface IReply extends Document {
  workerId: mongoose.Types.ObjectId;
  workerName: string;
  content: string;
  createdAt: Date;
}

export interface IPost extends Document {
  title: string;
  author: string;
  department: string;
  content: string;
  accessLevel: string;
  replies: IReply[];
  createdAt: Date;
}

const ReplySchema = new mongoose.Schema({
  workerId: mongoose.Schema.Types.ObjectId,
  workerName: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema({
  title: String,
  author: String,
  department: String,
  content: String,
  accessLevel: String,
  replies: [ReplySchema],
  createdAt: { type: Date, default: Date.now },
});

const Post = (mongoose.models.Post as Model<IPost>) || 
  mongoose.model<IPost>("Post", PostSchema);

export default Post;