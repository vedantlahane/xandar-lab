import { Schema, model, models } from "mongoose";

export interface IPipelineRun {
  _id: string;
  domain: string;
  status: "running" | "completed" | "failed";
  ideasGenerated: number;
  ideasSurvived: number;
  iterationsUsed: number;
  durationMs?: number;
  deliberation: Record<string, unknown>;
  criticStats?: {
    totalIdeasCritiqued: number;
    killed: number;
    revised: number;
    proceeded: number;
    killRate: number;
    iterationsUsed: number;
    maxIterationsHit: boolean;
  };
  error?: string;
  createdAt: Date;
}

const PipelineRunSchema = new Schema<IPipelineRun>(
  {
    domain: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["running", "completed", "failed"],
      required: true,
      index: true,
    },
    ideasGenerated: {
      type: Number,
      default: 0,
      min: 0,
    },
    ideasSurvived: {
      type: Number,
      default: 0,
      min: 0,
    },
    iterationsUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    durationMs: {
      type: Number,
      min: 0,
    },
    deliberation: {
      type: Schema.Types.Mixed,
      default: {},
    },
    criticStats: {
      totalIdeasCritiqued: { type: Number, default: 0 },
      killed: { type: Number, default: 0 },
      revised: { type: Number, default: 0 },
      proceeded: { type: Number, default: 0 },
      killRate: { type: Number, default: 0 },
      iterationsUsed: { type: Number, default: 0 },
      maxIterationsHit: { type: Boolean, default: false },
    },
    error: {
      type: String,
      maxlength: 5000,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    collection: "pipeline_runs",
    versionKey: false,
  }
);

PipelineRunSchema.index({ status: 1, createdAt: -1 });

const PipelineRun =
  models.PipelineRun || model<IPipelineRun>("PipelineRun", PipelineRunSchema);

export default PipelineRun;
