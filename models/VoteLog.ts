import mongoose, { Schema, model, models } from "mongoose";

export interface IVoteLog {
  ideaSlug: string;
  voterKey: string;
  voteType: "upvote" | "bookmark";
  createdAt: Date;
}

const VoteLogSchema = new Schema<IVoteLog>(
  {
    ideaSlug: { type: String, required: true },
    voterKey: { type: String, required: true },
    voteType: { type: String, enum: ["upvote", "bookmark"], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "voteLogs",
  }
);

VoteLogSchema.index(
  { ideaSlug: 1, voterKey: 1, voteType: 1 },
  { unique: true }
);

VoteLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 }
);

const VoteLog = models.VoteLog || model<IVoteLog>("VoteLog", VoteLogSchema);
export default VoteLog;
