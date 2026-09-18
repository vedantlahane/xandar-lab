// models/Experiment.ts
import mongoose, { Schema, model, models } from "mongoose";

export type ExperimentStatus = 'Active' | 'Completed' | 'Archived' | 'Planning';
export type ExperimentType = 'Frontend' | 'Backend' | 'Full Stack' | 'AI/ML' | 'Mobile' | 'DevOps';

export interface IChangeRequest {
    _id?: string;
    requestedBy: string;
    requestedById: mongoose.Types.ObjectId;
    requestedByRole: string;
    message: string;
    status: 'pending' | 'resolved';
    createdAt: Date;
    resolvedAt?: Date;
}

export interface IExperiment {
    _id: string;
    authorId: mongoose.Types.ObjectId;
    authorUsername: string;
    authorRole?: string;
    title: string;
    description: string;
    status: ExperimentStatus;
    type: ExperimentType;
    tags: string[];
    githubUrl?: string;
    liveUrl?: string;
    startDate?: string;
    completedDate?: string;
    techStack: string[];
    highlights: string[];
    visibility: 'private' | 'public';
    isPinned?: boolean;
    isCurated?: boolean;
    changeRequests?: IChangeRequest[];
    upvotes: number;
    upvotedBy: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ExperimentSchema = new Schema<IExperiment>(
    {
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        authorUsername: {
            type: String,
            required: true,
            trim: true,
        },
        authorRole: {
            type: String,
            default: 'user',
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        description: {
            type: String,
            required: true,
            default: '',
        },
        status: {
            type: String,
            enum: ['Active', 'Completed', 'Archived', 'Planning'],
            default: 'Active',
            index: true,
        },
        type: {
            type: String,
            enum: ['Frontend', 'Backend', 'Full Stack', 'AI/ML', 'Mobile', 'DevOps'],
            default: 'Full Stack',
            index: true,
        },
        tags: {
            type: [String],
            default: [],
            index: true,
        },
        githubUrl: {
            type: String,
            trim: true,
        },
        liveUrl: {
            type: String,
            trim: true,
        },
        startDate: {
            type: String,
        },
        completedDate: {
            type: String,
        },
        techStack: {
            type: [String],
            default: [],
        },
        highlights: {
            type: [String],
            default: [],
        },
        visibility: {
            type: String,
            enum: ['private', 'public'],
            default: 'public',
            index: true,
        },
        upvotes: {
            type: Number,
            default: 0,
        },
        upvotedBy: {
            type: [String],
            default: [],
        },
        isPinned: {
            type: Boolean,
            default: false,
            index: true,
        },
        isCurated: {
            type: Boolean,
            default: false,
            index: true,
        },
        changeRequests: [
            {
                requestedBy: { type: String, required: true },
                requestedById: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                requestedByRole: { type: String, default: 'admin' },
                message: { type: String, required: true },
                status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
                createdAt: { type: Date, default: Date.now },
                resolvedAt: { type: Date },
            },
        ],
    },
    {
        timestamps: true,
    }
);

ExperimentSchema.index({ visibility: 1, createdAt: -1 });
ExperimentSchema.index({ authorId: 1, visibility: 1 });

export default models.Experiment || model<IExperiment>("Experiment", ExperimentSchema);
