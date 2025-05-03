import mongoose, { Document, Model } from "mongoose";

export interface ITask extends Document {
  workerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  department: string;
  dependencies: string[];
  status: "In Progress" | "Completed" | "Planning" | "Delayed";
  dueDate: Date;
  createdDatetime: Date;
}

const TaskSchema = new mongoose.Schema({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
    required: true
  },
  title: {
    type: String,
    required: [true, "Please enter the task name"]
  },
  description: {
    type: String,
    required: [true, "Please enter the task description"]
  },
  department: {
    type: String,
    required: [true, "Please enter the department involved in the task"]
  },
  dependencies: {
    type: [String],
    required: [true, "Please enter dependencies involved in the task"]
  },
  status: {
    type: String,
    enum: ["In Progress", "Completed", "Planning", "Delayed"],
    default: "Planning"
  },
  dueDate: {
    type: Date,
    required: [true, "Please enter the task due date"]
  },
  createdDatetime: {
    type: Date,
    default: Date.now
  }
});

const Task = (mongoose.models.Task as Model<ITask>) || 
  mongoose.model<ITask>("Task", TaskSchema);

export default Task;