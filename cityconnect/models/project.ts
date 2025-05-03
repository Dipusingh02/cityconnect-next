import mongoose, { Document, Model } from "mongoose";

export interface IMilestone {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: string;
  completionPercentage: number;
  completed: boolean;
}

export interface IBudget {
  total: number;
  utilized: number;
}

export interface IContactPerson {
  name: string;
  position: string;
  phone: string;
  email: string;
}

export interface IFeedback {
  user: string;
  comment: string;
  date: Date;
}

export interface IProject extends Document {
  projectCode: string;
  workerId: mongoose.Types.ObjectId;
  title: string;
  objective: string;
  description: string;
  scopeOfWork?: string;
  technologiesUsed: string[];
  departments: string[];
  leadDepartment: string;
  status: "Planning" | "In Progress" | "Completed" | "Delayed";
  location: string;
  startDate: Date;
  deadline: Date;
  milestones: IMilestone[];
  progressPercentage: number;
  lastUpdated: Date;
  budget: IBudget;
  challenges?: string;
  impact?: string;
  contactPerson?: IContactPerson;
  media: string[];
  publicFeedback: IFeedback[];
  createdDatetime: Date;
}

const projectSchema = new mongoose.Schema({
  projectCode: {
    type: String,
    required: true,
    unique: true
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
    required: true
  },
  title: {
    type: String,
    required: [true, "Please enter the project name"]
  },
  objective: {
    type: String,
    required: [true, "Please enter the project objective"]
  },
  description: {
    type: String,
    required: [true, "Please enter the project description"]
  },
  scopeOfWork: {
    type: String
  },
  technologiesUsed: {
    type: [String],
    default: []
  },
  departments: {
    type: [String],
    required: true
  },
  leadDepartment: {
    type: String,
    required: [true, "Please enter the lead department"]
  },
  status: {
    type: String,
    enum: ["Planning", "In Progress", "Completed", "Delayed"],
    default: "Planning"
  },
  location: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  milestones: [
    {
      title: String,
      description: String,
      startDate: Date,
      endDate: Date,
      status: String,
      completionPercentage: Number,
      completed: Boolean
    }
  ],
  progressPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  budget: {
    total: {
      type: Number,
      required: true
    },
    utilized: {
      type: Number,
      default: 0
    }
  },
  challenges: {
    type: String
  },
  impact: {
    type: String
  },
  contactPerson: {
    name: String,
    position: String,
    phone: String,
    email: String
  },
  media: {
    type: [String],
    default: []
  },
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
  createdDatetime: {
    type: Date,
    default: Date.now
  }
});

const Project = (mongoose.models.Project as Model<IProject>) || 
  mongoose.model<IProject>("Project", projectSchema);

export default Project;