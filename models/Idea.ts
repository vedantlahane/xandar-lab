import mongoose, { Schema, model, models } from "mongoose";

export interface IEvidenceItem {
  source: string;
  url: string;
  snippet?: string;
}

export interface IIdea {
  _id: string;
  title: string;
  slug: string;
  problem: string;
  solution: string;
  targetUser: string;
  whyNow?: string;
  domain: string;
  tags: string[];
  confidence: number;
  complexity: "low" | "medium" | "high";
  timeline?: string;
  techStack: string[];
  monetization?: string;
  risks?: string;
  evidence: IEvidenceItem[];
  marketData: Record<string, unknown>;
  techReview: Record<string, unknown>;
  batchId: string;
  iteration: number;
  upvotes: number;
  bookmarks: number;
  status: "published" | "draft" | "archived" | "flagged";
  signalDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const IdeaSchema = new Schema<IIdea>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 220,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    problem: {
      type: String,
      required: true,
      maxlength: 15000,
    },
    solution: {
      type: String,
      required: true,
      maxlength: 15000,
    },
    targetUser: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    whyNow: {
      type: String,
      maxlength: 4000,
    },
    domain: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      index: true,
    },
    complexity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
      index: true,
    },
    timeline: {
      type: String,
      maxlength: 120,
    },
    techStack: {
      type: [String],
      default: [],
    },
    monetization: {
      type: String,
      maxlength: 4000,
    },
    risks: {
      type: String,
      maxlength: 8000,
    },
    evidence: {
      type: Schema.Types.Mixed,
      default: [],
    },
    marketData: {
      type: Schema.Types.Mixed,
      default: {},
    },
    techReview: {
      type: Schema.Types.Mixed,
      default: {},
    },
    batchId: {
      type: String,
      required: true,
      index: true,
    },
    iteration: {
      type: Number,
      default: 1,
      min: 1,
    },
    status: {
      type: String,
      enum: ["published", "draft", "archived", "flagged"],
      default: "published",
      index: true,
    },
    signalDate: {
      type: Date,
      default: Date.now,
    },
    upvotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    bookmarks: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    collection: "ideas",
    timestamps: true,
  }
);

IdeaSchema.index({ domain: 1 });
IdeaSchema.index({ confidence: -1 });
IdeaSchema.index({ complexity: 1 });
IdeaSchema.index({ createdAt: -1 });
IdeaSchema.index(
  {
    title: "text",
    problem: "text",
    solution: "text",
    targetUser: "text",
    tags: "text",
  },
  {
    weights: {
      title: 10,
      tags: 8,
      problem: 5,
      solution: 3,
      targetUser: 2,
    },
    name: "idea_text_search",
  }
);

const Idea = models.Idea || model<IIdea>("Idea", IdeaSchema);
export default Idea;
