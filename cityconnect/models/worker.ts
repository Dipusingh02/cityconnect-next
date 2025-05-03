import mongoose, { Document, Model } from "mongoose";
import isEmail from "validator/lib/isEmail";

export interface IWorker extends Document {
  name: string;
  email: string;
  password: string;
  employeeId: string;
  createdDatetime: Date;
}

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"]
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Minimum password length is 6 characters"]
  },
  employeeId: {
    type: String,
    required: [true, "Please enter your employee ID"]
  },
  createdDatetime: {
    type: Date,
    default: Date.now
  }
});

const Worker = (mongoose.models.Worker as Model<IWorker>) || 
  mongoose.model<IWorker>("Worker", workerSchema);

export default Worker;