import mongoose, { Document, Model } from "mongoose";

export interface IFeedback {
  user: string;
  comment: string;
  date: Date;
}

export interface IIssue extends Document {
  title: string;
  description: string;
  department: string;
  location: string;
  status: "Pending" | "In Progress" | "Resolved" | "Rejected";
  attachment?: string;
  project?: mongoose.Types.ObjectId;
  projectName?: string;
  publicFeedback: IFeedback[];
  createdAt: Date;
}

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved", "Rejected"],
    default: "Pending"
  },
  attachment: { type: String },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: false
  },
  projectName: { type: String },
  publicFeedback: [
    {
      user: String,
      comment: String,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

const Issue = (mongoose.models.Issue as Model<IIssue>) || 
  mongoose.model<IIssue>("Issue", issueSchema);

export default Issue;